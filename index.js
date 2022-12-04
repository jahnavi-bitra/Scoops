const { request } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const request1 = require('request')

const {initializeApp , cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");
const math=
{
	add:function(a,b)
	{
		return a+b;
	}
}

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
app.set("view engine","ejs");



app.get("/",(req,res)=>{
	res.render('signup')
});

app.use(express.static('public'));

app.get("/login",(req,res)=>{
	res.render("login");
});

app.get("/loginsubmit",(req,res)=>{
	const user=req.query.lmail;
	const pwd=req.query.lpass;
	db.collection("ice").where("email","==",user).where("password","==",pwd).get().then((docs) => {
		if(docs.size > 0){
			res.render("homepage");
		}
		else{
			res.render("signup");
		}
	});
});

app.get("/signup",(req,res)=>{
	res.render("signup");
});

app.get("/signupsubmit",(req,res)=>{
	console.log(req.query.gmail);
	console.log(req.query.pass);
		db.collection("ice").add({
		email:req.query.gmail,
		password:req.query.pass
		
	}).then(()=>{
		res.render("login");
	});
});

app.get("/home",(req,res)=>{
	res.render("home");
});


app.listen(port,()=>{
	console.log(`You are in port number ${port}`);
});

app.get("/addedToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=eval(c.slice(0,c.length-2));
	console.log(c);
	amount=math.add(amount,c);
	arr.push(val);
	
});

const arr=[];
const costs=[];
var amount=0;
app.get("/addToCart"),(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=eval(c.slice(0,c.length-2));
	console.log(c);
	amount=math.add(amount,c);
	arr.push(val);
}
app.get("/cart",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("scoops").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{booksData : arr, amount : amount, costs : costs});
		});
	}
});