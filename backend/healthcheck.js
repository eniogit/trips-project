import process from 'process';
const response = await fetch('http://localhost:8080/health');

if (response.ok) {
  console.log('Server is up and running');
  process.exit(0);
} else {
  console.error('Server is down');
  process.exit(1);
}
