var ejs = require("ejs");
var fs = require("fs");

Object.prototype.extend = function(obj) {
   
};

if (module.parent) {
    module.exports = RendererFactory;
} else {
   var bodyPath = process.argv[2];
   var renderer = RendererFactory("./data/", "./views/layout.ejs");
   var compiled = renderer(bodyPath);
   
   writeToDirectory(compiled, "./compiled", bodyPath);

   process.exit(-1);
}
    
function RendererFactory(templateDir, layoutPath) {
    return execute;
    
    function execute(bodyPath,bodyFill) {
        console.time("[st.render]");
        var layout = getLayout(layoutPath);
        var body =  getBody(bodyPath);
        body = ejs.render(body,bodyFill);
        var compiled = render(body,layout);
        console.timeEnd("[st.render]");
        return compiled;
    }
    function getLayout(layoutPath) {
        console.log(`[st.render]: Getting layout from ${layoutPath}`);
        var layout = fs.readFileSync(layoutPath,'utf8');
        return layout;
    }

    function getBody(bodyPath) {
        console.log(`[st.render]: Getting body from ${bodyPath}`);
        var body = fs.readFileSync(templateDir+"/"+bodyPath+".ejs",'utf8');
        return body;
    }

    function render(body, layout, defaultData) {
        for (var i in defaultData) {
            if (defaultData.hasOwnProperty(i)) {
                body[i] = body[i] || defaultData[i];
            }
        }

        var compiled = ejs.render(layout, { body : Object.extend(body, defaultData) });

        return compiled;
    }  
}    
    
 function writeToDirectory (compiled, directory, name) {
        var writePath = directory+"/"+name+".html";
        fs.writeFileSync(writePath, compiled);
        return writePath;
}    
