var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//var mongodbURL = 'mongodb://rebeccalcchan.cloudapp.net:27017/test';
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
		if(req.body.lon!=null&&req.body.lat!=null)
		{rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		}
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
				console.log('Error Occur!');
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
				console.log('Error Occur!');
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

//for delete grades
app.put('/restaurant_id/:attrib_value/grade/:skey/:skey_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	var criteria = {};
	var skeyv={};
	db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function (callback) 
		{	
			var Restaurant = mongoose.model('Restaurant', restaurantSchema);
			//if(req.body.date != null||req.body.grade!=null||req.body.score!=null)
			//{
				var jsonstring = {};
				jsonstring[req.params.skey] = req.params.skey_value;
			//rObj.grades.push(jsonstring);
			//}
			var keycri = {};
			keycri['restaurant_id'] = req.params.attrib_value;
			console.log(JSON.stringify(keycri));
		
			var queryString2 = {$pull:{grades:jsonstring}};
			console.log(JSON.stringify(queryString2));
			//console.log(r);
			//if(isNaN(parseInt(req.body.score))==false)
			var obj = {restaurant_id: req.params.attrib_value, grades:{$elemMatch:jsonstring}};
			if(isNaN(parseInt(req.params.skey_value))&&req.params.skey=='score')
			{

				console.log("score is not a number!");
				res.status(200).json({message: 'score is not a number!'});
				db.close();
				
			}
			else
			{
			console.log(obj);
			Restaurant.find(obj,function(err,results){
       				if (err) {
					res.status(500).json(err);
					throw err
					}
				else{	console.log(results);
					if (results.length > 0) 
					{
						
						Restaurant.update( keycri, queryString2, function(err,results) 
						{
       							if (err) {
								res.status(500).json(err);
								console.log('Error Occur!');
								throw err
								}
							else{
					
       								console.log('Restaurant Updates!');
					
       								res.status(200).json({message: 'update done', id: req.params.skey_value});
								}
						
    						});



					}
					else {
						res.status(200).json({message: 'No matching document'});
						
					}
				}	
				db.close();
			});
			
	

			}

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
	var searchcri={};

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	if(req.params.searchkey=='restaurant_id'&&req.params.attrib=='grade')
	{
		db.once('open', function (callback) 
		{	
			var Restaurant = mongoose.model('Restaurant', restaurantSchema);
			//if(req.body.date != null||req.body.grade!=null||req.body.score!=null)
			//{
				var jsonstring = {"date":req.body.date,"grade":req.body.grade,"score":req.body.score};
			//rObj.grades.push(jsonstring);
			//}
			var keycri = {};
			keycri['restaurant_id'] = req.params.searchkey_value;
			console.log(JSON.stringify(keycri));
		
			var queryString2 = {$push:{grades:jsonstring}};
			console.log(JSON.stringify(queryString2));
			//console.log(r);
			//if(isNaN(parseInt(req.body.score))==false)

				console.log(isNaN(parseInt(req.body.score)));
				console.log(parseInt(req.body.score));
			if(isNaN(parseInt(req.body.score)))
			{

				console.log("score is not a number!");
				res.status(200).json({message: 'score is not a number!'});
				db.close();
				
			}
			else
			{

			
			
	
			Restaurant.update( keycri, queryString2, function(err,results) 
			{
       				if (err) {
					res.status(500).json(err);
					console.log('Error Occur!');
					throw err
				}
				else{
       					console.log('Restaurant Updates!');
       					res.status(200).json({message: 'update done', id: req.params.searchkey_value});
				}
			db.close();
    			});
			}

		});
	}
	else if(req.params.attrib=='address')
	{
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function (callback) 
		{
			var Restaurant = mongoose.model('Restaurant', restaurantSchema);
			searchcri[req.params.searchkey] = req.params.searchkey_value;
			var criteria2 = {};
			criteria2={$set:{address:req.body}};   //.replace("+", " ");
			
			Restaurant.update( searchcri,criteria2 , function(err,results) 
			{
       				if (err) {
					res.status(500).json(err);
					console.log('Error Occur!');
					throw err
				}
				else{
       					console.log('Restaurant Updates!');
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
       				console.log('Restaurant Updates!');
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
		target[req.params.target] = req.params.target_value;
		queryString1 = {"restaurant_id":req.params.id,"grades":{$elemMatch:target}};
		queryString2 = {$set:criteria};

		console.log("find:"+JSON.stringify(queryString1)+JSON.stringify(queryString2));

		Restaurant.update(queryString1,queryString2, function(err,results) {
			if (err) {
				res.status(500).json(err);
				console.log('Updates Fails!');
				throw err
			}
			else{
				
				console.log('Restaurant Updates!');
				res.status(200).json({message: 'update done', id: req.params.id});
			}
		
		});
	
	});
	db.close();
});

app.get('/', function(req,res) {
	res.write("Hello!");
	console.log('Get something!');
});

app.listen(process.env.PORT || 8099);
