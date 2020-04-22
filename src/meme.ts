import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { Meme } from './database/meme.entity';
import { password, username } from './utils';

export async function getId(firstInput: string): Promise<number> {
  // If the firstInput is a number
  if (!Number.isNaN(Number(firstInput))) {
    // type it to a number and return it
    return Number(firstInput);
  } else {
    const memes = (await Meme.find()).map((m) => ({
      ...m,
      name: m.name.toLowerCase()
    }));
    const meme = memes.find((m) => m.name === firstInput.toLowerCase());
    return Number(meme?.id || -1);
  }
}

export async function makeMeme(input: string[]) {
  // if there are 3 items in the input array
  if (input.length < 3) {
    // return immediately with error message
    return Promise.resolve(
      '@SilverBot meme *meme name / id* "meme" "text" "per" "textbox"'
    );
  }

  const startingURL = 'https://api.imgflip.com/caption_image';

  // start constructing payload to send to imgflip API
  const payload: any = {
    // find meme id from first item in array
    template_id: await getId(input[0]),
    username,
    password
  };

  // if id is not found, exit and return error message
  if (payload.template_id === -1) {
    return Promise.resolve('Meme not found!');
  }

  // loop through input and add it to the request
  for (let i = 1; i < input.length; ++i) {
    payload[`boxes[${i}][text]`] = input[i];
  }

  // construct the request once the payload has finished being constructed
  let url = `${startingURL}?`;
  for (const item in payload) {
    if (item) {
      url += `${item}=${payload[item]}&`;
    }
  }
  // take off the extra '&'
  url = url.substring(0, url.length - 1);

  // do the request
  return await fetch(url, {
    method: 'POST'
  })
    .then((res) => res.json())
    .then((data) => {
      // if there is a meme return it
      if (data['data']) {
        return data['data']['url'] as string;
      } else {
        // otherwise, return that the meme could not be found!
        return 'Meme not found!';
      }
    });
}

interface MemeData {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export async function setMemes(connection: Connection) {
  // read the file
  const memes = await Meme.find();
  // if the file does not have anything in it
  if (!memes || !memes.length) {
    // do a request to get all of the memes
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((json) => {
        if (json && json['data']) {
          // set the memes array and save it to disk
          const memeData: MemeData[] = json['data']['memes'];
          const allMemes: Meme[] = memeData.map((meme) => Meme.create(meme));
          connection.getRepository(Meme).save(allMemes);
        }
      });
  }
}
