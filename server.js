var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://rebeccalcchan.cloudapp.net:27017/test';
var mongoose = require('mongoose');

app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.address = {};
		rObj.address.building = req.body.building;
		rObj.address.street = req.body.street;
		rObj.address.zipcode = req.body.zipcode;
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		rObj.borough = req.body.borough;
		rObj.cuisine = req.body.cuisine;
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;
		rObj.grades = [];
		//var record = {};
		//record.date=req.body.date;
		//record.grade=req.body.grade;
		//record.score=req.body.score;
		if(req.body.date != null||req.body.grade!=null||req.body.score!=null)
		{
			var jsonstring = {"date":req.body.date,"grade":req.body.grade,"score":req.body.score};
			rObj.grades.push(jsonstring);
		}

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', id: r._id});
    	});
    });
});

app.delete('/:attrib/:attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	var criteria = {};
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);

		criteria[req.params.attrib] = req.params.attrib_value;
		Restaurant.find(criteria).remove(function(err) {
			if (err) {
				res.status(500).json(err);
				throw err
   			}
         		//console.log('Restaurant removed!')
        		db.close();
   			res.status(200).json({message: 'delete done', id: req.params.id});
		});
	});
});

app.get('/restaurant_id/:id', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});

//new test get method for get any attribute
app.get('/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	var criteria = {};
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		
		criteria[req.params.attrib] = req.params.attrib_value.replace("+", " ");
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});

//new test get method 2 for get variable of address
app.get('/address/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	var criteria = {};
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		criteria["address."+req.params.attrib] = req.params.attrib_value.replace("+", " ");
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});

//new test get method 3 for get grade records
app.get('/grades/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	var criteria = {};
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		criteria["grades."+req.params.attrib] = req.params.attrib_value.replace("+", " ");
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
    	});
    });
});

// to update any
app.put('/:id/:attrib/:attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var criteria = {};
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);

		criteria[req.params.attrib] = req.params.attrib_value;   //.replace("+", " ");
		//Restaurant.find({restaurant_id: req.params.id}).update({$set:criteria}, function(err) {
		Restaurant.update( {restaurant_id: req.params.id},criteria , function(err,results) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			console.log('Restaurant UPdates!');
       			res.status(200).json({message: 'update done', id: req.params.id});
			//res.status(200).json({message: 'Update done', id: req.params.id});
			db.close();
    	});
    });
}); 


// to update any testing
app.put('/:searchkey/:searchkey_value/:attrib/:attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var criteria = {};
	var searchcri={};
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);

		criteria[req.params.attrib] = req.params.attrib_value;   //.replace("+", " ");
		searchcri[req.params.searchkey] = req.params.searchkey_value;
		//Restaurant.find({restaurant_id: req.params.id}).update({$set:criteria}, function(err) {
		Restaurant.update( searchcri,criteria , function(err,results) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			console.log('Restaurant UPdates!');
       			res.status(200).json({message: 'update done', id: req.params.id});
			//res.status(200).json({message: 'Update done', id: req.params.id});
			db.close();
    	});
    });
}); 


// to update address
app.put('/address/:searchkey/:searchkey_value/:attrib/:attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var criteria = {};
	var searchcri={};
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		searchcri[req.params.searchkey] = req.params.searchkey_value;
		criteria["address."+req.params.attrib] = req.params.attrib_value;   //.replace("+", " ");
		//Restaurant.find({restaurant_id: req.params.id}).update({$set:criteria}, function(err) {
		Restaurant.update( searchcri,criteria , function(err,results) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       			console.log('Restaurant UPdates!');
       			res.status(200).json({message: 'update done', id: req.params.id});
			//res.status(200).json({message: 'Update done', id: req.params.id});
			db.close();
    	});
    });
}); 

// to update grade
app.put('/grades/:id/:target/:target_value/:attrib/:attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var criteria = {};
	var find = {};
	var querystring1={};
	var queryString2 = {};
	var target = {};
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		
		criteria["grades.$."+req.params.attrib] = req.params.attrib_value;
		//console.log("criteria:"+JSON.stringify(criteria));
		//find[restaurant_id] = req.params.id; 
		target[req.params.target] = req.params.target_value;
		//console.log("find:"+JSON.stringify(find));
		queryString1 = {"restaurant_id":req.params.id,"grades":{$elemMatch:target}};
		queryString2 = {$set:criteria};

		console.log("find:"+JSON.stringify(queryString1)+JSON.stringify(queryString2));
		Restaurant.update(queryString1,queryString2, function(err,results) {
			if (err) {
				res.status(500).json(err);
				throw err
			}
		console.log('Restaurant UPdates!');
		res.status(200).json({message: 'update done', id: req.params.id});
		//res.status(200).json({message: 'Update done', id: req.params.id});
		db.close();
		});
	});
});


app.get('/', function(req,res) {
	console.log("hello testing");
});

app.listen(process.env.PORT || 8099);
