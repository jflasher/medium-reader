'use strict';

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var request = require('request');
var sinon = require('sinon');
require('should');

var getPosts = require('../index.js');
var sampleData = fs.readFileSync(path.resolve(__dirname, 'data.xml'), 'UTF-8');

var s; // Holder for sinon mocks
describe('Package', function() {
  describe('#getPosts()', function() {
    before(function(done) {
      s = sinon
        .stub(request, 'get')
        .yields(null, null, null);    
        done();
    });

    after(function(done) {
      request.get.restore();
      done();
    });

    it('should fail if not given a name', function (done) {
      getPosts('', function(err, posts) {
        expect(err).to.exist();
        expect(posts).to.not.exist();
        request.get.called.should.be.equal(false);
        done();
      });
    });

     it('should fail if it can not parse Medium result', function (done) {
      s.yields(null, null, 'result');
      getPosts('asd', function(err, posts) {
        expect(err).to.exist();
        expect(posts).to.not.exist();
        request.get.called.should.be.equal(true);
        done();
      });
    });    

     it('should successfully get result from api', function (done) {
      s.yields(null, null, sampleData);
      getPosts('asd', function(err, posts) {
        expect(err).to.not.exist();
        expect(posts).to.exist();
        request.get.called.should.be.equal(true);
        done();
      });
    }); 

    it('should parse data into something nice', function (done) {
      s.yields(null, null, sampleData);
      getPosts('asd', function(err, posts) {
        expect(err).to.not.exist();
        expect(posts).to.exist();
        request.get.called.should.be.equal(true);
        expect(posts.length).to.equal(1);
        expect(posts[0].title).to.equal('We bought a boat!');
        expect(posts[0].description).to.equal('<div class="medium-feed-item"><p class="medium-feed-image"><a href="https://medium.com/@sv_ff/we-bought-a-boat-79d7e3d98a4a"><img src="https://d262ilb51hltx0.cloudfront.net/fit/c/600/200/1*G21gqfOtrHTtkPGUQ6uvpg.jpeg" width="600" height="200"></a></p><p class="medium-feed-snippet">Christa surprised me with a trip up to Maine for my birthday last year. While on that trip, we stayed a night on a small, very old wooden&#8230;</p><p class="medium-feed-link"><a href="https://medium.com/@sv_ff/we-bought-a-boat-79d7e3d98a4a">Continue reading on Medium »</a></p></div>');
        expect(posts[0].plainDescription).to.equal('Christa surprised me with a trip up to Maine for my birthday last year. While on that trip, we stayed a night on a small, very old wooden&#8230;');
        expect(posts[0].link).to.equal('https://medium.com/@sv_ff/we-bought-a-boat-79d7e3d98a4a');
        expect(posts[0].pubDate).to.equal('Mon, 26 Jan 2015 00:59:13 GMT');
        done();
      });
    });
  });
});