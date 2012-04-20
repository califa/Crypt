//------------------File Model-------------------------//
var File = Backbone.Model.extend({
	defaults: {
		name: "undefined",
		size: "undefined",
		data: "undefined",
		type: "undefined",
	}
});
var Files = Backbone.Collection.extend({
	model: File
});
var files = new Files();
files.add([{
	name: "High Security",
	size: "2 MegaBytes",
	data: "Very Important",
	type: "Personal Information"
},{	name: "Moderate Security",
	size: "54 KiloBytes",
	data: "Somewhat Important",
	type: "Receipt"
},{	name: "Low Security",
	size: "3 KiloBytes",
	data: "Not Important",
	type: "Note"
}]);

var FileSystem = Backbone.Model.extend({
	defaults: {
		files: files,
		size: "400 GigaBytes"
	}
});
//--------------------------------------------------------//

//---------------------------Log Model-------------------------//
var Log = Backbone.Model.extend({
	defaults: {
		from: "unknown",
		to: "unknown",
		time: "unknown"
	}
});

var Logs = Backbone.Collection.extend({
	model: Log
});

var logs = new Logs();
logs.add([{
	from: "A", 
	to: "B",
	time: "2 Minutes ago"
},{
	from: "C",
	to: "D",
	time: "1 Hour ago"
},{
	from: "E",
	to: "here"
}]);

var Wall = Backbone.Model.extend({
	defaults: {
		type: "Strong Wall",
		username:"Peter",
		password: "Kim"
	}
});

//---------------------Server Model-----------------------------//
var ServerModel = Backbone.Model.extend({
	initialize: function() {
		console.log('model initialized');
		/*this.bind('change:name', function(){
			console.log(this.get('name'));
		});
		this.bind('error', function(model, error){
			console.error(error);
		});*/
	},

	defaults: {
		type: "Corporate",
		name: "Sony",
		ip: "123.123.123.123",
		wall: new Wall(),
		fileSystem: new FileSystem(),
		log: logs

	},

	validate: function (attributes) {

	}

});
//------------------------------------------------------------//

//---------------------Server View----------------------------//
var ServerView = Backbone.View.extend({
	initialize: function() {
		console.log('view initialized');
		this.template = $('#list-template');
		this.render();
	},
	el: '#serverList',
	render: function() {
		var ultemplate = this.template.find('ul');
		var litemplate = this.template.find('li');
		var modelAttr = this.model.attributes;
		var wallAttr = modelAttr.wall.attributes;
		var fileAttr = modelAttr.fileSystem.attributes.files;
		var logAttr = modelAttr.log;	
		var name = $('<h1>Server: ' + modelAttr.name + '</h1>');
		var ip = litemplate.clone().text('IP: ' + modelAttr.ip);
		var type = litemplate.clone().text('Type: ' + modelAttr.type);
		var wall = litemplate.clone().text('Wall: ')
		var wallList = ultemplate.clone();
		var wallType = litemplate.clone().text('Type: ' + wallAttr.type);
		var wallUser = litemplate.clone().text('Username: '  + wallAttr.username);
		var wallPass = litemplate.clone().text('Password: ' + wallAttr.password);
		var filesystem = litemplate.clone().text('Filesystem: ');
		var filelist = ultemplate.clone().text('Files: ');
		var filesytemSize = ultemplate.clone().text('Capacity: '+ modelAttr.fileSystem.attributes.size);
		var files = new Array();
		for (var i = 0, l = fileAttr.length; i < l; i++ ){
			var fileName = litemplate.clone().text("File Name: " + fileAttr.models[i].attributes.name);
			var fileType = litemplate.clone().text("File Type: " + fileAttr.models[i].attributes.type);
			var fileData = litemplate.clone().text("File Data: " + fileAttr.models[i].attributes.data);
			var fileSize = litemplate.clone().text("File Size: " + fileAttr.models[i].attributes.size);
			files[i]= ultemplate.clone().text('File'+ (i + 1) + ": ");
			files[i].append(fileName, fileType, fileData, fileSize);
			filelist.append(files[i]);
		}
		var logs = litemplate.clone().text("Logs: ");
		var logList = ultemplate.clone();
		var log = new Array();
		for (var i = 0, l = logAttr.length; i < l; i++){
			log[i] = litemplate.clone().text('Log' + (i + 1) + ": From '" + logAttr.models[i].attributes.from + "' to '" + logAttr.models[i].attributes.to + "' since " + logAttr.models[i].attributes.time);
			logList.append(log[i]);
		}

		logs.append(logList);
		filesystem.append(filesytemSize, filelist);
		wallList.append(wallType,wallUser,wallPass);
		wall.append(wallList);
		this.$el.append(name,ip,type,wall,filesystem,logs);
	}
});
//-------------------------------------------------------//

var serverModel = new ServerModel();
var serverView = new ServerView({model: serverModel});
//server.set('name','Joe');
//console.log(serverModel.attributes);
//console.log(serverModel.get('log').models[0].get('from')); //by indexing models
//console.log(serverModel.get('log').getByCid('c4'));	//This one filtering by Cid
//console.log(serverModel.get('log').at(2)); //This one is passing index
//console.log(serverModel.get('log').pluck('from')); //Plucking values of certain attributes.
//console.log(server.get('name'));