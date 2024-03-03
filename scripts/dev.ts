// import minimist from 'minimist';
import { execa } from 'execa';

// const argv = process.argv.slice(2);


// const args = minimist(argv)

// console.log('hello world==>', args);

execa('rollup', ['-wc', '--configPlugin', 'typescript', '--bundleConfigAsCjs'], {
  stdio: 'inherit'
});
