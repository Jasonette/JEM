var shell = require('shelljs');
shell.cd('/Users/wajahat/Desktop/JASONETTE-iOS/app');

try{
/*var version = shell.exec('pod install', {silent :true}).stdout;
console.log("Current path " + version);*/
/*var child = shell.exec('pod install', {async:true});
child.stdout.on('data', function(data){
    console.log("I am finished");
});*/
shell.exec('pod install', function(code, stdout,stderr){
  console.log('Exit code : ', code);
  console.log('Program output : ', stdout);
  console.log('Program stederr : ', stderr);
});
}
catch(e){
  console.log("i am exception");
}
