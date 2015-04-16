"use strict";angular.module("realwestfest",["ngAnimate","ngTouch","ui.router","ngMaterial","RecursionHelper"]).config(["$mdThemingProvider",function(e){e.theme("default").primaryPalette("blue").accentPalette("grey")}]).config(["$sceProvider",function(e){e.enabled(!1)}]).config(["$contentProvider",function(e){e.setFirebaseRef("https://realwestdev.firebaseio.com"),e.setTemplates(["film","music","special","venue","sponsor","about","contact","news"]),e.blacklistPages(["venues"])}]),angular.module("realwestfest").controller("VenuesCtrl",["$scope","$location","$anchorScroll","venues",function(e,t,n,a){console.log(t.hash()),n(),a.onValue(function(t){e.venues=t})}]),angular.module("realwestfest").factory("utils",["$q",function(){var e={};return e.uuid=function(){var e=Date.now(),t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:7&n|8).toString(16)});return t},e.sort=function(t,n){return n=n||0,_(t).groupBy(function(e){return e.tags&&e.tags[n]}).thru(function(t){return 1===_.keys(t).length&&t.undefined?_.filter(t.undefined,"name"):_.mapValues(t,function(t){return e.sort(t,n+1)})}).thru(function(e){return e.undefined&&!e.other&&(e.other=e.undefined,delete e.undefined),e}).value()},e.getTagList=function(e){return console.log(e),_.isArray(e)||(e=_([]).push(e).value()),_(e).pluck("tags").flatten().uniq().value()},e.tagsToString=function(e){return e&&e.join(", ")},e.isEvent=function(e){return _.has(e,"times")},e}]),angular.module("realwestfest").factory("toast",["$mdToast",function(e){var t=function(t){e.show(e.simple().content(t).position("top right").hideDelay(1500))};return t}]),angular.module("realwestfest").directive("dayInSchedule",function(){return{templateUrl:"app/schedule/partials/dayinschedule.html",restrict:"E",scope:{allEvents:"=events",date:"="},link:function(e){var t=function(e,t){return _.filter(e,function(e){var n=Number(e.startTime),a=new Date(n);return a.getDate()===t})};e.$watch("allEvents",function(){e.events=_.sortBy(t(e.allEvents,e.date),"startTime")})}}}),angular.module("realwestfest").controller("scheduleCtrl",["$scope","$timeout","content","utils",function(e,t,n,a){e.content=n,n.map(function(e){return _.filter(e,a.isEvent)}).map(function(e){return _(e).map(function(e){return _.map(e.times,function(t){return _.assign(_.clone(e),t)})}).flatten().value()}).onValue(function(n){t(function(){e.events=n},0)})}]),angular.module("realwestfest").factory("s3",["$q","utils",function(e,t){var n={},a={bucket:"realwestfest",access_key:"AKIAIY5TSJAWPNAP6SPA",secret_key:"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"};AWS.config.update({accessKeyId:a.access_key,secretAccessKey:a.secret_key}),AWS.config.region="us-west-2";var i=new AWS.S3({params:{Bucket:a.bucket}});return n.upload=function(n){return e(function(e,a){var r=n.name.split(/\.(\w+)$/)[1];console.log(r);var o=t.uuid()+"."+r,s="img/"+o,l={Key:s,ContentType:n.type,Body:n,ServerSideEncryption:"AES256"};i.putObject(l,function(t){return t?a(t.message):e(o)}).on("httpUploadProgress",function(e){console.log(Math.round(e.loaded/e.total*100)+"% done")})})},n}]),angular.module("realwestfest").directive("sponsorsPage",function(){return{templateUrl:"app/page/partials/sponsors-page.html",restrict:"E",scope:{sponsors:"=content"},link:function(){}}}),angular.module("realwestfest").directive("pageContent",["RecursionHelper","$log",function(e,t){return{templateUrl:"app/page/partials/page-content.html",restrict:"E",scope:{content:"=",pageType:"=",type:"="},transclude:!0,controllerAs:"pageCtrl",controller:["$scope",function(e){console.log(e),this.isBase=function(e){return _.isArray(e)}}],compile:function(n){return e.compile(n,function(e){e.$log=t})}}}]),angular.module("realwestfest").directive("newsPage",function(){return{templateUrl:"app/page/partials/news-page.html",restrict:"E",scope:{news:"=content"},link:function(){}}}).directive("articleBody",["$marked",function(e){return{template:'<article ng-bind-html="displayText"></article>',restrict:"E",scope:{entry:"="},link:function(t){marked.setOptions(e.options),t.$watch("entry",function(e){console.log(e,e.article),t.displayText=marked(e.article)})}}}]),angular.module("realwestfest").directive("eventsPage",function(){return{templateUrl:"app/page/partials/events-page.html",restrict:"E",scope:{content:"="},link:function(){}}}),angular.module("realwestfest").directive("aboutPage",function(){return{templateUrl:"app/page/partials/about-page.html",restrict:"E",scope:{content:"=",type:"="},link:function(e){console.log(e)}}}),angular.module("realwestfest").directive("navbar",["$timeout","$content","utils",function(e,t,n){return{templateUrl:"app/navbar/partials/navbar.html",restrict:"E",link:function(e){e.content.map(function(e){return _(n.sort(e)).keys().filter(t.showPage).value()}).onValue(function(t){e.pages=t},0)}}}]),angular.module("realwestfest").directive("listing",["$content",function(e){return{templateUrl:"app/listing/partials/listing.html",restrict:"E",replace:!0,controllerAs:"listing",link:function(t){t.venues=[],t.event.venue?(t.times=[],t.times.push(t.event),e.getAsValue("venues",t.event.venue).then(function(e){t.venues.push(e)})):t.event.times&&t.event.times[0].venue&&(t.times=t.event.times,_.each(t.event.times,function(n){e.getAsValue("venues",n.venue).then(function(e){t.venues.push(e)})}))}}}]),angular.module("realwestfest").factory("ixSettings",function(){var e={};return e.options={updateOnResizeDown:!0,pixelStep:10,autoInsertCSSBestPractices:!0},e}),angular.module("realwestfest").provider("$content",function(){var e,t,n,a={};this.setFirebaseRef=function(t){e=new Firebase(t),e=e.child("content")},this.setTemplates=function(e){t=e},this.blacklistPages=function(e){n=e},this.$get=["$q",function(i){return a.getAsProperty=function(t){var n=t?e.child(t):e;return i(function(e){var t=Kefir.fromEvent(n,"value").map(function(e){return e.val()}).map(_.values);t.onValue(function(n){e(t.toProperty(n))})})},a.getAsValue=function(t){var n=t?e.child(t):e;return i(function(e){n.once("value",function(t){var n=t.val()||{_id:t.key()};e(n)})})},a.update=function(t){var n=e.child(t._id);return i(function(e,a){n.set(t,function(t){return t?a(t):e()})})},a.remove=function(t){if(!t)throw new Error("need id!");var n=e.child(t);return i(function(e,t){n.remove(function(n){return n?t(n):e()})})},a.create=function(){return e.push().key()},a.getTemplates=function(){return t},a.showPage=function(e){return-1===_.indexOf(n,e)?!0:!1},a.getBaseRef=function(){return e},a}]}),angular.module("realwestfest").controller("PageCtrl",["$scope","$timeout","type","content","utils",function(e,t,n,a,i){e.pageType=n,e.content=a,a.map(function(e){return i.sort(e)[n]}).onValue(function(n){t(function(){e.events=n},0)})}]),angular.module("realwestfest").factory("imageResize",["$q",function(e){var t={};return t.resize=function(t,n){var a=e.defer(),i=new Image;i.src=t;var r=i.naturalWidth,o=i.naturalHeight,s=n,l=Math.floor(o/r*s),c=document.createElement("canvas"),u=c.getContext("2d");c.width=r,c.height=o,u.drawImage(i,0,0,r,o);var p=document.createElement("canvas");return p.width=s,p.height=l,pica.resizeCanvas(c,p,{quality:2},function(e){if(e)return a.reject(e);var t="image/jpeg",n=p.toDataURL(t);a.resolve(n)}),a.promise},t}]),angular.module("realwestfest").factory("eventInterface",function(){var e={_id:null,name:{type:"string",field:"input"},description:{type:"string",field:"textarea"},url:{type:"url",field:"input"},image:{type:"file",field:"file"}},t=_.assign(e,{duration:{type:"number",field:"input"},year:{type:"string",field:"input"},director:{type:"string",field:"input"},trailer:{type:"url",field:"input"}});return{film:t}}),angular.module("realwestfest").directive("uploadImage",["$q","s3","ixSettings",function(e,t,n){return{template:'<input type="file" />',restrict:"E",replace:!0,controllerAs:"upload",scope:{model:"=ngModel"},link:function(e,a){a.bind("change",function(){var i=a[0].files[0];return/^image\//.test(i.type)?void t.upload(i).then(function(t){e.model="//realwestfest.imgix.net/"+t,console.log("uploaded",t),imgix.fluid(n.options)}).catch(function(e){throw new Error(e)}):void alert("not an image")})}}}]),angular.module("realwestfest").directive("timeInput",function(){return{restrict:"A",require:"ngModel",link:function(e,t,n,a){a.$parsers.push(function(e){return chrono.parseDate(e).getTime()}),a.$formatters.push(function(e){if(!e)return void 0;var t=new Date(Number(e));return t.toString()})}}}),angular.module("realwestfest").directive("selectTemplate",["$content",function(e){return{templateUrl:"app/cms/partials/select-template.html",restrict:"E",require:"^editContent",scope:!0,controllerAs:"selectCtrl",controller:["$scope",function(e){this.update=function(){e.master.template=e.content.template}}],link:function(t,n,a,i){t.content=i.content,t.master=i.master,t.templates=e.getTemplates()}}}]),angular.module("realwestfest").directive("inputTag",["$content","utils",function(e,t){return{template:'<span ng-class="inputCtrl.getClass(tag)" ng-repeat="tag in content.tags track by $index">{{ tag }} </span>       						<input type="text" ng-blur="inputCtrl.onKey(\'blur\')" ng-keypress="inputCtrl.onKey($event)" placeholder="enter categories" required ng-model="themodel" />',restrict:"EA",require:"^editContent",scope:!0,controllerAs:"inputCtrl",controller:["$scope",function(e){this.onKey=function(t){("blur"===t||44===t.keyCode||13===t.keyCode)&&(e.content.tags=e.themodel&&e.themodel.split(/\s*,\s*/))},this.getClass=function(t){return _.contains(e.categories,t)?"exists":"new"}}],link:function(n,a,i,r){n.content=r.content,n.themodel=t.tagsToString(n.content.tags),e.getAsProperty().then(function(e){e.onValue(function(e){n.categories=t.getTagList(e)})})}}}]),angular.module("realwestfest").directive("imgix",["ixSettings",function(e){return{template:'<img class="imgix-fluid" data-src="{{ ixSrc }}" alt=""> ',replace:!0,restrict:"E",scope:{ixSrc:"="},link:function(t,n){n.ready(function(){imgix.fluid(e.options)})}}}]),angular.module("realwestfest").directive("imgixBg",["ixSettings",function(e){return{template:'<div class="imgix-fluid" data-src="{{ ixSrc }}" alt=""></div> ',replace:!0,restrict:"E",scope:{ixSrc:"="},link:function(t,n){n.ready(function(){imgix.fluid(e.options)})}}}]),angular.module("realwestfest").factory("editMixin",function(){return{restrict:"E",require:"^editContent",scope:!0,link:function(e,t,n,a){e.content=a.content}}}).directive("editFilm",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-film.html"},e)}]).directive("editMusic",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-music.html"},e)}]).directive("editSpecial",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-special.html"},e)}]).directive("editVenue",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-venue.html"},e)}]).directive("editSponsor",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-sponsor.html"},e)}]).directive("editAbout",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-about.html"},e)}]).directive("editContact",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-contact.html"},e)}]).directive("editNews",["editMixin",function(e){return _.merge({templateUrl:"app/cms/partials/edit-news.html"},e)}]).directive("autoGrow",function(){return function(e,t,n){var a=function(){t.css("height","auto"),t.css("height",t[0].scrollHeight+"px")};e.$watch(n.ngModel,function(){a()}),n.$set("ngTrim","false")}}),angular.module("realwestfest").directive("description",function(){return{template:'<md-input-container>                 <label for="">Description</label>                 <textarea ng-model="content.description"></textarea>                 </md-input-container>',restrict:"EA"}}).directive("newsArticle",function(){return{template:'<md-input-container>                 <label for="">Article (in markdown)</label>                 <textarea auto-grow type="text" ng-model="content.article"></textarea>                 </md-input-container>',restrict:"EA"}}).directive("name",function(){return{template:'<md-input-container>                 <label for="">Name</label>                 <input type="text" ng-model="content.name"/>                 </md-input-container>',restrict:"EA"}}).directive("email",function(){return{template:'<md-input-container>                 <label for="">email</label>                 <input type="email" ng-model="content.email"/>                 </md-input-container>',restrict:"EA"}}).directive("phone",function(){return{template:'<md-input-container>                 <label for="">phone</label>                 <input type="text" ng-model="content.phone"/>                 </md-input-container>',restrict:"EA"}}).directive("person",function(){return{template:'<md-input-container>                 <label for="">person</label>                 <input type="text" ng-model="content.person"/>                 </md-input-container>',restrict:"EA"}}).directive("artists",function(){return{template:'<md-input-container>                 <label for="">Artist(s)</label>                 <input type="text" ng-model="content.artists"/>                 </md-input-container>',restrict:"EA"}}).directive("duration",function(){return{template:'<md-input-container>                 <label for="">Duration in minutes</label>                 <input type="text" ng-model="content.duration" />                 </md-input-container>',restrict:"EA"}}).directive("year",function(){return{template:'<md-input-container>                 <label for="">Year</label>                 <input type="text" ng-model="content.year"/>                 </md-input-container>',restrict:"EA"}}).directive("homepage",function(){return{template:'<md-input-container>                 <label for="">Homepage</label>                 <input type="text" ng-model="content.homepage"/>                 </md-input-container>',restrict:"EA"}}).directive("bandcamp",function(){return{template:'<md-input-container>                 <label for="">Bandcamp</label>                 <input type="text" ng-model="content.bandcamp"/>                 </md-input-container>',restrict:"EA"}}).directive("facebook",function(){return{template:'<md-input-container>                 <label for="">Facebook</label>                 <input type="text" ng-model="content.facebook"/>                 </md-input-container>',restrict:"EA"}}).directive("price",function(){return{template:'<md-input-container>                 <label for="">Price</label>                 <input type="text" ng-model="content.price"/>                 </md-input-container>',restrict:"EA"}}),angular.module("realwestfest").directive("editContent",["$content","$state","toast","utils",function(e,t,n){return{templateUrl:"app/cms/partials/edit-content.html",restrict:"E",scope:{content:"="},transclude:!0,controllerAs:"editContent",controller:["$scope",function(a){var i=this;i.save=function(){e.update(i.content).then(function(){n("Updates Saved!")})},i.delete=function(){e.remove(a.content._id).then(function(){console.log("removed")}),t.go("cms")},i.content=angular.copy(a.content),i.master=a.content}],link:function(t){t.templates=e.getTemplates()}}}]),angular.module("realwestfest").directive("cmsNavbar",["$state",function(e){return{templateUrl:"app/cms/partials/cms-navbar.html",restrict:"E",controller:function(){},link:function(){console.log(e)}}}]),angular.module("realwestfest").directive("cmsContentList",["RecursionHelper","$log",function(e,t){return{templateUrl:"app/cms/partials/cms-content-list.html",restrict:"E",scope:{content:"=",type:"="},compile:function(n){return e.compile(n,function(e){e.$log=t})}}}]),angular.module("realwestfest").directive("addOccurrence",["$content","utils",function(e){return{templateUrl:"app/cms/partials/add-time.html",restrict:"E",require:"^editContent",scope:!0,controllerAs:"addOccurrence",controller:["$scope",function(e){this.addOccurrence=function(){e.content.times=e.content.times||[],e.content.times.push({startTime:null,venue:null})},this.deleteOccurrence=function(t){e.content.times.splice(t,1)}}],link:function(t,n,a,i){t.content=i.content,e.getAsProperty().then(function(e){e.map(function(e){return _(e).where({tags:["venue"]}).value()}).tap(function(e){console.log(e)}).onValue(function(e){t.venues=e})})}}}]),angular.module("realwestfest").directive("addImage",["$timeout",function(){return{template:'<h3>Image</h3> 								<img ng-if="content.image" ng-src="{{ content.image }}?w=400" ></img> 								<md-input-container> 								<upload-image ng-model="content.image"></upload-image> 								</md-input-container>',restrict:"E",require:"^editContent",scope:!0,link:function(e,t,n,a){e.content=a.content}}}]),angular.module("realwestfest").controller("newCtrl",["$scope","$content","content","utils",function(e,t,n,a){n.onValue(function(t){e.categories=a.getTagList(t)}),console.log(e.templates),this.create=function(){e.cms.newContent(e.newness)}}]),angular.module("realwestfest").controller("editVenueCtrl",["$scope","$state","$content","venue",function(e,t,n,a){e.venue=angular.copy(a),e.venue.type="venue",this.saveVenue=function(){n.update("venues",a._id,e.venue)},this.delete=function(){n.remove("venues",a._id).then(function(){console.log("removed")}),t.go("cms")}}]),angular.module("realwestfest").controller("editFilmCtrl",["$scope","event",function(e,t){e.event=t,e.venues=Venue.getVenues(),this.getVenueName=Venue.getVenueName}]),angular.module("realwestfest").controller("editCtrl",["$scope","$stateParams","$state","$content","content","utils","toast",function(e,t,n,a,i){e.content=i,e.template=e.content.template}]),angular.module("realwestfest").controller("cmsCtrl",["$scope","$state","$timeout","$content","content","utils",function(e,t,n,a,i,r){i.onValue(function(t){n(function(){e.content=r.sort(t),console.log(e.content),console.log(t)},0)}),this.newContent=function(){var e=a.create();t.go("cms.edit",{id:e})}}]),angular.module("realwestfest").controller("aboutCtrl",["$scope",function(){}]),angular.module("realwestfest").factory("AttractionsFactory",["fb",function(e){var t={};return t.ref=e.child("attractions"),t.getAllAttractions=function(){var e=Kefir.fromEvent(t.ref,"value").toProperty();return e},t.getAttractionByScreening=function(){},t}]),angular.module("realwestfest").factory("$marked",function(){var e={};return e.options={renderer:new marked.Renderer,gfm:!0,tables:!0,breaks:!0,pedantic:!1,sanitize:!1,smartLists:!0,smartypants:!1},e}),angular.module("realwestfest").controller("footerCtrl",["$scope",function(e){e.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("realwestfest").controller("NavbarCtrl",["$scope",function(e){e.date=new Date}]),angular.module("realwestfest").controller("MainCtrl",["$scope","$content","content",function(e,t,n){e.content=n}]),angular.module("realwestfest").config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl",resolve:{content:["$content",function(e){return e.getAsProperty()}]}}).state("schedule",{url:"/schedule",templateUrl:"app/schedule/partials/schedule.html",controller:"scheduleCtrl as schedule",resolve:{content:["$content",function(e){return e.getAsProperty()}]}}).state("page",{url:"/page/:type",templateUrl:"app/events/partials/events.html",controller:"PageCtrl as pageCtrl",resolve:{content:["$content",function(e){return e.getAsProperty()}],type:["$stateParams",function(e){return e.type}]}}).state("cms",{url:"/cms",templateUrl:"app/cms/partials/cms.html",controller:"cmsCtrl as cms",resolve:{content:["$content",function(e){return e.getAsProperty()}]}}).state("cms.edit",{url:"/edit/:id/",templateUrl:"app/cms/partials/edit.html",controller:"editCtrl as edit",resolve:{content:["$content","$stateParams",function(e,t){return e.getAsValue(t.id)}]}}).state("cms.new",{url:"/new",templateUrl:"app/cms/partials/new.html",controller:"newCtrl as new",resolve:{content:["$content",function(e){return e.getAsProperty()}]}}),t.otherwise("/")}]),angular.module("realwestfest").run(["$templateCache",function(e){e.put("app/main/main.html",'<div id="home"><header><navbar></navbar></header><div class="email"><h2>April 16<sup>th</sup> – 18<sup>th</sup>, 2015</h2><h2>enter your email & stay posted</h2><form action="//realwestfest.us10.list-manage.com/subscribe/post?u=7bdcb2538fed142a04ff4d38f&amp;id=d1acd88e4e" method="post" class="validate" target="_blank" novalidate=""><input type="email" name="EMAIL" required=""><div style="position: absolute; left: -5000px;"><input type="text" name="b_7bdcb2538fed142a04ff4d38f_d1acd88e4e" tabindex="-1" value=""></div><button>submit</button></form><div class="social"><a href="http://facebook.com/realwestfest" target="_blank"><img src="assets/images/facebook-square.svg" alt=""></a> <a href="http://twitter.com/realwestfest" target="_blank"><img src="assets/images/twitter.svg" alt=""></a></div></div></div>'),e.put("app/about/partials/about.html",'<div id="about"><header ng-include="\'components/navbar/navbar.html\'"></header><div class="content"><p>Pendleton, Oregon is a city with a rich history of craftsmanship, a world class rodeo and an abundance of civic pride. This heritage is woven into the Pendleton Real West Festival and naturally informs its character. This celebration of classic western cinema and music also embraces voices of Native Americans and contemporary artists of the West.</p></div><footer ng-include="\'components/footer/partials/footer.html\'"></footer></div>'),e.put("app/cms/partials/add-time.html",'<div class="add-occurence"><h2>Events:</h2><div class="event-time" ng-repeat="time in content.times track by $index"><md-input-container><label for="">Time</label> <input time-input="" type="text" placeholder="i.e. April 7th at 5pm" ng-model="time.startTime" ng-model-options="{ updateOn: \'blur\'}"></md-input-container><div class="input-container"><label>Venue</label><select ng-model="time.venue" ng-options="venue._id as venue.name for venue in venues"><option value="">No Venue Yet</option></select></div><md-input-container><label>EventBrite Link</label> <input type="text" ng-model="time.ticketlink"></md-input-container><button type="button" class="remove-event" ng-click="addOccurrence.deleteOccurrence($index)">remove</button></div><button type="button" class="add-event" ng-click="addOccurrence.addOccurrence()">add an event</button></div>'),e.put("app/cms/partials/cms-content-list.html",'<span ng-if="type && !content._id">{{ type }}</span> <span ng-if="content.name"><a ui-sref="cms.edit({ id: content._id })">{{ content.name }}</a></span><ul><li ui-sref-active="active" ng-if="!content._id" ng-repeat="(type, val) in content"><cms-content-list content="val" type="type"></cms-content-list></li></ul>'),e.put("app/cms/partials/cms-navbar.html",""),e.put("app/cms/partials/cms.html",'<div id="cms"><md-sidenav md-component-id="cms-nav" id="cms-nav" md-is-locked-open="$mdMedia(\'gt-md\')"><cms-content-list content="content"></cms-content-list><a class="new-content" ng-click="cms.newContent()">+</a></md-sidenav><ui-view></ui-view></div>'),e.put("app/cms/partials/edit-about.html","<name></name><description></description>"),e.put("app/cms/partials/edit-contact.html","<name></name><person></person><email></email><phone></phone>"),e.put("app/cms/partials/edit-content.html",'<form class="editevent" ng-submit="editContent.save()"><input-tag></input-tag><ng-transclude></ng-transclude><div class="edit-buttons"><button>SAVE</button> <button ng-click="editContent.delete()" class="delete" type="button">DELETE</button></div></form>'),e.put("app/cms/partials/edit-film.html","<add-image></add-image><name></name><artists></artists><duration></duration><year></year><homepage></homepage><description></description><add-occurrence></add-occurrence>"),e.put("app/cms/partials/edit-music.html","<add-image></add-image><name></name><artists></artists><homepage></homepage><bandcamp></bandcamp><facebook></facebook><description></description><add-occurrence></add-occurrence>"),e.put("app/cms/partials/edit-news.html",'<name></name><md-input-container><label for="">Date</label> <input time-input="" type="text" placeholder="i.e. April 7th at 5pm" ng-model="content.date" ng-model-options="{ updateOn: \'blur\'}"></md-input-container><news-article></news-article>'),e.put("app/cms/partials/edit-special.html","<add-image></add-image><name></name><price></price><description></description><add-occurrence></add-occurrence>"),e.put("app/cms/partials/edit-sponsor.html","<add-image></add-image><name></name><description></description>"),e.put("app/cms/partials/edit-venue.html",'<name></name><md-input-container><label for="">Address</label> <input type="text" ng-model="content.address"></md-input-container><md-input-container><label for="">Google Maps Link</label> <input type="text" ng-model="content.googlemaps"></md-input-container><description></description>'),e.put("app/cms/partials/edit.html",'<edit-content content="content" ng-switch="content.template"><select-template></select-template><edit-film ng-switch-when="film"></edit-film><edit-music ng-switch-when="music"></edit-music><edit-venue ng-switch-when="venue"></edit-venue><edit-special ng-switch-when="special"></edit-special><edit-sponsor ng-switch-when="sponsor"></edit-sponsor><edit-about ng-switch-when="about"></edit-about><edit-contact ng-switch-when="contact"></edit-contact><edit-news ng-switch-when="news"></edit-news></edit-content>'),e.put("app/cms/partials/new.html",'<form class="editevent" ng-submit="new.create()"><input-tag tags="newness.tags" categories="categories"></input-tag><button>Create</button></form>'),e.put("app/cms/partials/select-template.html",'<div class="select-template"><label>Template</label><select ng-change="selectCtrl.update()" ng-model="content.template" ng-options="template for template in templates"><option value="">Please Pick a Template</option></select></div>'),e.put("app/events/partials/events.html",'<div id="events"><header><navbar></navbar></header><page-content content="events" page-type="pageType"></page-content></div>'),e.put("app/listing/partials/listing.html",'<div class="listing"><div class="time"><div ng-repeat="venue in venues"><h2>{{ times[$index].startTime | date: \'shortTime\' }}</h2><h3>{{ times[$index].startTime | date: \'MMMM d\' }}</h3><p class="venue">{{ venue.name }} <a href="{{ venue.googlemaps }}" target="_blank"><span class="address">{{ venue.address }}</span> <span>(view in Google Maps)</span></a></p><a ng-href="{{ times[$index].ticketlink }}" ng-if="times[$index].ticketlink" target="_blank"><button>Reserve Ticket</button></a></div></div><div class="details"><imgix-bg class="img" ix-src="event.image"></imgix-bg><div class="title"><h2>{{ event.name }}</h2></div><h3>{{ event.artists }} <span ng-if="event.year">||</span> {{ event.year }} <span ng-if="event.duration">||</span> {{ event.duration }} <span ng-if="event.duration">minutes</span></h3><h3 ng-if="event.type === \'music\'"><a ng-if="event.homepage" href="{{ event.homepage }}">Homepage</a><a ng-if="event.bandcamp" href="{{ event.bandcamp }}">Bandcamp</a><a ng-if="event.faacebook" href="{{ event.facebook }}">Facebook</a></h3><p>{{ event.description}}</p></div></div>'),e.put("app/navbar/partials/navbar.html",'<div class="hero"><div class="header"><div class="logo"><a ui-sref="home"><img src="assets/images/Pendleton_logo_black.svg" alt=""></a></div><nav><ul ng-if="pages"><li ui-sref-active="active"><a ui-sref="schedule">schedule</a></li><li ui-sref-active="active" ng-repeat="type in pages"><a ui-sref="page({ type: type })">{{ type }}</a></li></ul></nav></div></div>'),e.put("app/page/partials/about-page.html",'<div id="about-page" ng-switch="type"><div ng-switch-when="about"><div ng-repeat="about in content"><p class="description">{{about.description}}</p></div></div><div ng-switch-when="contact"><div ng-repeat="contact in content"><h2>Phone</h2><h3>{{ contact.phone }}</h3><h2>Email</h2><h3><a href="mailto:realwestfeatival@gmail.com">{{ contact.email }}</a></h3></div></div></div>'),e.put("app/page/partials/events-page.html",'<listing type="type" ng-repeat="event in content | orderBy: event.times[0]"></listing>'),e.put("app/page/partials/news-page.html",'<div id="news-page" ng-repeat="article in news"><article><h4>{{ article.date | date: \'MMMM d, yyyy\'}}</h4><article-body entry="article"></article-body></article></div>'),e.put("app/page/partials/page-content.html",'<div ng-if="pageCtrl.isBase(content)" ng-switch="pageType"><events-page ng-switch-when="events" content="content" type="type"></events-page><sponsors-page ng-switch-when="sponsors" content="content" type="type"></sponsors-page><about-page ng-switch-when="about" content="content" type="type"></about-page><news-page ng-switch-when="news" content="content" type="type"></news-page></div><md-tabs ng-if="!pageCtrl.isBase(content)" md-stretch-tabs="always"><md-tab ng-repeat="(type, results) in content" label="{{ type }}"><page-content content="results" page-type="pageType" type="type"></page-content></md-tab></md-tabs>'),e.put("app/page/partials/sponsors-page.html",'<div id="sponsors-page"><div ng-repeat="sponsor in sponsors"><div class="image"><img ng-src="{{ sponsor.image}}?w=400"></div><div class="details"><h2>{{ sponsor.name}}</h2><p>{{ sponsor.description }}</p></div></div></div>'),e.put("app/schedule/partials/dayinschedule.html",'<listing ng-repeat="event in events track by event.startTime" event="event" listing-type="event.type"></listing>'),e.put("app/schedule/partials/schedule.html",'<div id="schedule"><header><navbar></navbar></header><md-tabs md-stretch-tabs="always"><md-tab md-noink="" label="Thursday - 16th"><day-in-schedule events="events" date="16"></day-in-schedule></md-tab><md-tab label="Friday - 17th"><day-in-schedule events="events" date="17"></day-in-schedule></md-tab><md-tab label="Saturday - 18th"><day-in-schedule events="events" date="18"></day-in-schedule></md-tab></md-tabs></div>'),e.put("app/venues/partials/venues.html",'<div id="venues"><header ng-include="\'components/navbar/navbar.html\'"></header><div ng-repeat="venue in venues"><p id="{{ venue._id }}">{{ venue.name }}</p></div></div>'),e.put("components/footer/partials/footer.html",'<nav><ul><li><a href="mailto:realwestfest@gmail.com">email</a></li><li>541.979.9714</li></ul></nav>')}]);