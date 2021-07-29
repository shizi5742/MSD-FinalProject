const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

router.post('/loads', (req,res)=>{
req.db.collection
	req.db.collection("Loads")
	.insertOne({
		loadNumber: req.body.loadNumber,
		from: req.body.from,
		to: req.body.to,
		pickupDate: req.body.pickupDate,
		pickupTime: req.body.pickupTime,
		dropofDate: req.body.dropofDate,
		dropofTime: req.body.dropofTime,
		fare: req.body.fare,
		confirmed: "false",
		deleted: "false",
	})
	.then(data =>{
		res.status(200).json({status: "success", result: data})
	})
})

router.get("/loads", (req, res) => {
  req.db
    .collection("Loads")
    .find({confirmed: "true", deleted: "false"})
    .toArray((err, data) => {
      console.log(data);
      res.status(200).json({ status: "success", result: data });
    });
});

router.put("/loads/:id", (req,res)=>{
	req.db.collection("Loads")
	.updateOne({_id: new ObjectId(req.params.id)}, {$set: {deleted: "true"}})
	.then(data=>{
		res.json({status: "success", result: data})
	})
})

router.get("/drivers", (req, res) => {
  req.db
    .collection("Drivers")
    .find()
    .toArray((err,data) => {
      res.status(200).json({ status: "success", result: data });
    });
});




module.exports = router;
