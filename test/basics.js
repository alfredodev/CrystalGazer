"use strict"

const chai = require('chai');
const mocha = require('mocha');
const cg = require('../src/crystalgazer.js');
const expect = chai.expect;

describe("Basic operations", function(){
    it("should get the number of commits", function(){
        var cgConfig = {
            workingDirectory: "test",
            name: 'numCommits1'
        };

        cg.init(cgConfig);
        var result = cg.numberOfCommits();

        expect(result).to.equal(4);
    });

    it("should get the number of files changed", function(){
        var cgConfig = {
            workingDirectory: "test",
            name: 'numCommits1'
        };

        cg.init(cgConfig);
        var result = cg.numberOfFilesChanged();
        
        expect(result).to.equal(21);
    });

    it("should get the files by type", function(){
        var expected = [
            {extension: "cs", files: 14},
            {extension: "js", files: 6}            
        ];

        var cgConfig = {
            workingDirectory: "test",
            name: 'numCommits1'
        };

        cg.init(cgConfig);
        var result = cg.filesByType();

        expect(result).to.have.ordered.deep.members(expected);
    });

    it("should get authors", function(){
        var expected = ["Jonathan Channon", "Andreas Hakansson"];

        var cgConfig = {
            workingDirectory: "test",
            name: 'numCommits1'
        };

        cg.init(cgConfig);
        var result = cg.authors();

        expect(result).to.have.ordered.members(expected);
    });
});

describe("Basic operations acceptance tests", function(){
    it("should get the number of commits", function(){
        var cgConfig = {
            workingDirectory: "test",
            name: 'nancy'
        };

        cg.init(cgConfig);
        var result = cg.numberOfCommits();

        expect(result).to.equal(5007);
    });

    it("should get the number of files changed", function(){
        var cgConfig = {
            workingDirectory: "test",
            name: 'nancy'
        };

        cg.init(cgConfig);
        var result = cg.numberOfFilesChanged();
        
        expect(result).to.equal(18223);
    });

    it("should get the files by type", function(){
        var expected = [
            {"extension": "cs", "files": 1963},
            {"extension": "dll", "files": 401},
            {"extension": "config", "files": 256},
            {"extension": "csproj", "files": 204},
            {"extension": "xml", "files": 143},
            {"extension": "cshtml", "files": 139},
            {"extension": "spark", "files": 110},
            {"extension": "nupkg", "files": 62}
        ];

        var cgConfig = {
            workingDirectory: "test",
            name: 'nancy'
        };

        cg.init(cgConfig);
        var result = cg.filesByType();

        expect(result).to.include.ordered.deep.members(expected);
    });

    it("should get authors", function(){
        var expected = [
            "Andreas H├Ñkansson",
            "Jonathan Channon",
            "Kristian Hellang",
            "Julien Roncaglia",
            "chrisc",
            "Chris Cosgriff",
            "mdk",
            "Dan Barua",
            "Sifiso Shezi",
            "Phillip Haydon",
            "Alan Evans",
            "Steven Robbins",
            "Asbj├©rn Ulsberg"
            ];

        var cgConfig = {
            workingDirectory: "test",
            name: 'nancy'
        };

        cg.init(cgConfig);
        var result = cg.authors();

        expect(result).to.include.ordered.members(expected);
    });
});