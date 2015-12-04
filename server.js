var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://localhost:27017/test';
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
		else{
			res.status(200).json({message: 'insert done', id: r._id});
		}
       		//console.log('Restaurant created!')
       		db.close();
		
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
			else
			{	
				res.status(200).json({message: 'delete done', id: req.params.id});
			}
         		//console.log('Restaurant removed!')
        		db.close();
   			
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
		else{
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
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
		else{
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
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
		else{
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
		}
		db.close();
    	});
    });
});

// to update any
app.put('/:searchkey/:searchkey_value/:attrib',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var criteria = {};
	var searchcri={};
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	if(req.params.searchkey=='restaurant_id'&&req.params.attrib=='grade')
	{
		db.once('open', function (callback) 
		{	
			var Restaurant = mongoose.model('Restaurant', restaurantSchema);
			if(req.body.date != null||req.body.grade!=null||req.body.score!=null)
			{
				var jsonstring = {"date":req.body.date,"grade":req.body.grade,"score":req.body.score};
			//rObj.grades.push(jsonstring);
			}
			criteria['restaurant_id'] = req.params.searchkey_value;
			console.log(JSON.stringify(criteria));
		
			var queryString2 = {$push:{grades:jsonstring}};
			console.log(JSON.stringify(queryString2));
			//console.log(r);
			Restaurant.update( criteria,queryString2 , function(err,results) 
			{
       				if (err) {
					res.status(500).json(err);
					throw err
				}
				else{
       					console.log('Restaurant UPdates!4');
       					res.status(200).json({message: 'update done', id: req.params.searchkey_value});
				}
			db.close();
    			});
		});
	}
	else if(req.params.attrib=='address')
	{
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function (callback) 
		{
			var Restaurant = mongoose.model('Restaurant', restaurantSchema);
			searchcri[req.params.searchkey] = req.params.searchkey_value;
			criteria={$set:{address:req.body}};   //.replace("+", " ");
		
			Restaurant.update( searchcri,criteria , function(err,results) 
			{
       				if (err) {
					res.status(500).json(err);
					throw err
				}
				else{
       					console.log('Restaurant UPdates!2');
       					res.status(200).json({message: 'update done', id: req.params.searchkey_value});
				}
			
				db.close();
    			});
   	 	});
	}
}); 


// to update more than one field of same id
app.put('/restaurant_id/:id',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var searchcri={};
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	
		db.once('open', function (callback) {
			var Restaurant = mongoose.model('Restaurant', restaurantSchema);

			searchcri['restaurant_id'] = req.params.id;

			Restaurant.update( searchcri,req.body , function(err,results) {
       			if (err) {
				res.status(500).json(err);
				console.log('Error Occur!');
				throw err
				}
			else{
       				console.log('Restaurant UPdates!first');
       				res.status(200).json({message: 'update done', id: req.params.id});
			}
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
			else{
				console.log('Restaurant UPdates!3');
				res.status(200).json({message: 'update done', id: req.params.id});
			}
		//res.status(200).json({message: 'Update done', id: req.params.id});
		db.close();
		});
	});
});

app.get('/', function(req,res) {
	res.write("Hello!");
	console.log('Get something!');
});

app.listen(process.env.PORT || 8099);
