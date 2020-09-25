const svc = require('./service');

try {
  svc.install();
  console.log('Successfully installed the service!');
  process.exit(0);
} catch (err) {
  console.error(err);
}
