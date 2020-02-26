let memes: { id: string; name: string; url: string }[] = [];
import { readFileSync, writeFileSync } from 'fs';
import { password, username } from './utils';

export function getId(firstInput: string): number {
  // If the firstInput is a number
  if (!Number.isNaN(Number(firstInput))) {
    // type it to a number and return it
    return Number(firstInput);
  } else {
    // Otherwise look for the meme with its name
    for (const meme of memes) {
      if (meme.name.toLowerCase().includes(firstInput.toLowerCase())) {
        // and return the id with the found name
        return Number(meme.id);
      }
    }
  }
  // return -1 if never found
  return -1;
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
  // find meme id from first item in array
  const templateId = getId(input[0]);
  // if id is not found, return error message
  if (templateId === -1) {
    return Promise.resolve('Meme not found!');
  }

  // start constructing payload to send to imgflip API
  const payload: any = {
    template_id: templateId,
    username,
    password
  };

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

export function setMemes() {
  // read the file
  memes = JSON.parse(readFileSync('./config/memes.json', 'utf8'));
  // if the file does not have anything in it
  if (!memes) {
    // do a request to get all of the memes
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then((json) => {
        if (json && json['data']) {
          // set the memes array and save it to disk
          memes = json['data']['memes'];
          writeFileSync('./config/memes.json', JSON.stringify(memes));
        }
      });
  }
}
