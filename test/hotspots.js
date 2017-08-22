"use strict"

const mocha = require('mocha');
const chai = require('chai');
const cg = require('../src/crystalgazer.js');
const expect = chai.expect;

describe("Hotspot analysis", function(){
    it("should get the number of revisions by file", function(){
        const cgConfig = {
            workingDirectory : "test",
            name: "numCommits1"
        };

        const expected = [
            {
                file: "samples/Nancy.Demo.Authentication.Forms/MainModule.cs",
                revisions: 2
            },
            {
                file: "samples/Nancy.Demo.Authentication/MainModule.cs",
                revisions: 1
            },
            {
                file: "samples/Nancy.Demo.Authentication.Basic/SecureModule.cs",
                revisions: 1
            },
            {
                file: "samples/Nancy.Demo.Hosting.Aspnet/MainModule.js",
                revisions: 1
            },
            {
                file: "samples/Nancy.Demo.Authentication.Forms/PartlySecureModule.cs",
                revisions: 1
            },
            {
                file: "samples/Nancy.Demo.Authentication.Forms/SecureModule.cs",
                revisions: 1
            },
            {
                file: "samples/Nancy.Demo.Authentication.Stateless/AuthModule.cs",
                revisions: 1
            }
        ];

        cg.init(cgConfig);
        let result = cg.revisionsByFile();

        expect(result).to.include.ordered.deep.members(expected);
    });

});