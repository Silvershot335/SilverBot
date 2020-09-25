const svc = require('./service');
try {
  svc.uninstall();
  console.log('Successfully uninstalled the service!');
  process.exit(0);
} catch (err) {
  console.error(err);
}
