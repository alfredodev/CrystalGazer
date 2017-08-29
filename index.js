"use strict"

const program = require('commander');
const cg = require('./src/crystalgazer');
const pkg = require('./package.json');
const dateFns = require('date-fns');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const screen = blessed.screen();

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

let getConfigFrom = function(configName, options){
    let workingDirectory = '.';
    
    if ( options.workingDirectory ){
        workingDirectory = options.workingDirectory;
    }

    const cgConfig = {
        workingDirectory: workingDirectory,
        name: configName
    };

    return cgConfig;
};

let drawTwoColumnTable = function(headers, data){
    const grid = new contrib.grid({rows: 1, cols: 1, screen: screen});
    const table = grid.set(0, 0, 1, 1,contrib.table,
        { keys: true
        , fg: 'white'
        , selectedFg: 'white'
        , selectedBg: 'blue'
        , interactive: true
        , label: 'Revisions by file (Press ESC to exit)'
        , width: '50%'
        , height: '50%'
        , border: {type: "line", fg: "cyan"}
        , columnSpacing: 5 //in chars
        , columnWidth: [60, 20] /*in chars*/ });

   
    //allow control the table with the keyboard
    table.focus();
   
    table.setData(
      { headers: headers
      , data: data});     

    screen.render();
};

let init = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);
    cg.init(cgConfig);
};

let numberOfCommits = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);
    console.log(cgConfig);
    const numberOfCommits = cg.numberOfCommits(cgConfig);

    console.log('Number of commits: ' + numberOfCommits);
};

let numberOfFilesChanged = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);    
    const numberOfFilesChanged = cg.numberOfFilesChanged(cgConfig);

    console.log('numberOfFilesChanged: ' + numberOfFilesChanged);
};

let filesByType = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);    
    const filesByType = cg.filesByType(cgConfig);

    console.log('filesByType: ' + JSON.stringify(filesByType));
};

let authors = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);    
    const authors = cg.authors(cgConfig);

    console.log('authors: ' + authors);
};

let revisionsByFile = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);    
    const revisionsByFile = cg.revisionsByFile(cgConfig);
    const headers = ['File name', '# Revisions'];
    const data = revisionsByFile.map(function(item){
        return [item.file, item.revisions];
    });

    drawTwoColumnTable(headers, data);    
};

let linesByFile = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);    
    const linesByFile = cg.linesByFile(cgConfig);

    const headers = ['File name', '# Lines'];
    const data = linesByFile.map(function(item){
        return [item.file, item.lines];
    });

    drawTwoColumnTable(headers, data);
};

let authorsByFile = function(configName, options){
    const cgConfig = getConfigFrom(configName, options);    
    const authorsByFile = cg.authorsByFile(cgConfig);

    const headers = ['File name', '# Authors'];
    const data = authorsByFile.map(function(item){
        return [item.file, item.authors];
    });

    drawTwoColumnTable(headers, data);
};

let addLineChartTo = function(grid, xpos, ypos, label, series){
    let line = grid.set(xpos, ypos, 1, 1,contrib.line,
        { style:
          { line: "yellow"
          , text: "green"
          , baseline: "black"}
        , xLabelPadding: 3
        , xPadding: 5
        , showLegend: false
        , wholeNumbersOnly: true //true=do not show fraction in y axis
        , label: label});

        screen.append(line);
        line.setData([series]);
}

let complexityOverTime = function(configName, fileName, options){
    const cgConfig = getConfigFrom(configName, options);    
    cg.complexityOverTime(cgConfig, fileName).then(function(complexity){
        const grid = new contrib.grid({rows: 2, cols: 1, screen: screen});
        
        var linesSeries = {
            title: 'Lines',
            x: complexity.map(function(c){return c.date;}),
            y: complexity.map(function(c){return c.numberOfLines;}),
            style: {
                line: 'blue'
               }
         };
        addLineChartTo(grid, 0, 0, 'Complexity (number of lines) over time (Press ESC to exit)',linesSeries);

        var tabsSeries = {
            title: 'Tabs',
            x: complexity.map(function(c){return c.date;}),
            y: complexity.map(function(c){return c.maxNumberOfTabs;}),
            style: {
                line: 'red'
            }
        };
        addLineChartTo(grid, 1, 0, 'Complexity (max # of tabs) over time (Press ESC to exit)',tabsSeries);
        screen.render();
    });    
};

program
    .version(pkg.version)
    .command('init <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(init);

program
    .command('numberOfCommits <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(numberOfCommits);

program
    .command('numberOfFilesChanged <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(numberOfFilesChanged);    

program
    .command('filesByType <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(filesByType); 
    
program
    .command('authors <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(authors);  

program
    .command('revisionsByFile <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(revisionsByFile); 

program
    .command('linesByFile <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(linesByFile); 
    
program
    .command('authorsByFile <configName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(authorsByFile); 

program
    .command('complexityOverTime <configName> <fileName>')
    .option('-w, --workingDirectory <working_directory>', 'working directory')
    .action(complexityOverTime); 

program.parse(process.argv);

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();