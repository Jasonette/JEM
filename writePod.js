var fs = require('fs');
var filePath = '/Users/wajahat/Desktop/JASONETTE-iOS/app/Podfile';
var pods = "{\"dependencies\":[\"pod \'wajahat chaudhry\'\",\"pod \'farhan munir\'\"]}";

function GetPodFileContent()
{
  var fs = require('fs');
  var content = fs.readFileSync(filePath, 'utf8');
  return content;
}
function GeneratePodFileContent(content,injection)
{
var string = content;
var preString = "pod ";
var searchString = "\n";
var preIndex = string.lastIndexOf(preString);
var searchIndex = preIndex + string.substring(preIndex).indexOf(searchString);
var pre = string.substr(0, searchIndex);
var post = string.substring(searchIndex)
return pre + injection + post;

}

function GetInjectablePods(content)
{
  var validDependencies = [];
  var jsonObj = JSON.parse(pods);
  var dependencies = jsonObj.dependencies;
  for(var i=0; i < dependencies.length; i++){
    if(content.indexOf(dependencies[i]) == -1){
        validDependencies.push("\n  " + dependencies[i]);
    }
  }
  return validDependencies;
}

function UpdatePodFile(content)
{
  fs.truncate(filePath, 0, function() {
      fs.writeFile(filePath, content, function (err) {
          if (err) {
              return console.log("Error writing file: " + err);
          }
          else {
            console.log("I am success");
          }
      });
  });
}




var content = GetPodFileContent();
var injectableDependencies = GetInjectablePods(content);
if(injectableDependencies.length > 0){
    var generatedPod = GeneratePodFileContent(content, injectableDependencies);
    UpdatePodFile(generatedPod);
}
else{
  console.log("i don't have any dependencies");
}
