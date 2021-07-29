var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();


// get user data
router.get("/profile", (req, res) => {
  req.db
    .collection("Drivers")
    .findOne({ email: req.email })
    .then((data) => {
      res.status(200).json({ status: "success", result: data });
    });
});


// get reserved loads
router.get("/loads", (req, res) => {
  req.db
    .collection("Loads")
    .find({ confirmed: "false" })
    .toArray((err, data) => {
      console.log(data);
      res.status(200).json({ status: "success", result: data });
    });
});


// get all routes 
router.get("/routes", (req, res) => {
  req.db
    .collection("Drivers")
    .findOne({ email: req.email })
    .then((data) => {
      res.json({ status: "success", result: data });
    });
});


// set driver status to active
router.put("/status", (req, res) => {
  req.db
    .collection("Drivers")
    .updateOne({ email: req.email }, { $set: { status: "Active" } })
    .then((data) => {
      res.json({ status: "success", result: data });
    });
});


// set driver status inActive
router.put("/status/inActive", (req, res) => {
  req.db
    .collection("Drivers")
    .updateOne({ email: req.email }, { $set: { status: "inActive" } })
    .then((data) => {
      res.json({ status: "success", result: data });
    });
});


// Add new route to driver 
router.put("/routes/:id", (req, res) => {
  req.db
    .collection("Loads")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((data) => {
      if (data) {
        let route = {
          loadID: data._id,
          loadNumber: data.loadNumber,
          from: data.from,
          to: data.to,
          pickupDate: data.pickupDate,
          pickupTime: data.pickupTime,
          dropofDate: data.dropofDate,
          dropofTime: data.dropofTime,
          fare: data.fare,
          confirmed: "false",
          deleted: "false",
          confirationNumber: Math.floor(Math.random() * 100000000000),
        };
        req.db
          .collection("Drivers")
          .updateOne({ email: req.email }, { $push: { routes: route } })
          .then((data1) => {
            res.json({ status: "success", result: data1 });
          });
      }
    });
});


// retrieve deleted loads 
router.post("/loads/:id", (req, res) => {
  req.db
    .collection("Drivers")
    .findOne({ loadID: req.params.id })
    .then((data) => {
      if (data) {
        req.db.collection;
        req.db
          .collection("Loads")
          .insertOne({
            _id: loadID,
            loadNumber: data.loadNumber,
            from: data.from,
            to: data.to,
            pickupDate: data.pickupDate,
            pickupTime: data.pickupTime,
            dropofDate: data.dropofDate,
            dropofTime: data.dropofTime,
            fare: data.fare,
            confirmed: "false",
            deleted: "false",
          })
          .then((data) => {
            res.status(200).json({ status: "success", result: data });
          });
      }
    });
});


// remove loads by setting the confirmed value to true
router.put("/remove/loads/:id", (req, res) => {
  req.db
    .collection("Loads")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { confirmed: "true" } }
    )
    .then((data) => {
      res.json({ status: "success", result: data });
    });
});


// update delete status to true 
router.put("/delete/status/:id", (req, res) => {
  req.db
    .collection("Loads")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { deleted: "true" } }
    )
    .then((data) => {
      res.json({ status: "success", result: data });
    });
});


// remove routes from driver current routes by setting the delete status true
router.put("/remove/routes/:id", (req, res) => {
  req.db
    .collection("Drivers")
    .updateOne(
      {
        email: req.email,
        routes: { $elemMatch: { loadID: new ObjectId(req.params.id) } },
      },
      { $set: { "routes.$.deleted": "true" } },
      { multi: true }
    )
    .then((data) => {
      console.log(data);
      res.json({ status: "success", result: data });
    });
});


// setting confirm status to true
router.put("/confirm/status/:id", (req, res) => {
  req.db
    .collection("Drivers")
    .updateOne(
      {
        email: req.email,
        routes: { $elemMatch: { loadID: new ObjectId(req.params.id) } },
      },
      { $set: { "routes.$.confirmed": "true" } },
      { multi: true }
    )
    .then((data) => {
      console.log(data);
      res.json({ status: "success", result: data });
    });
});


// post new invoice 
router.put("/invoice", (req, res) => {
  console.log(req.body.type);
  let invoice = {
    expense: req.body.expense,
    type: req.body.type,
    detail: req.body.detail,
    date: new Date(),
  };
  req.db
    .collection("Drivers")
    .updateOne({ email: req.email }, { $push: { invoice: invoice } })
    .then((data) => {
      res.json({ status: "success", result: data });
    });
});


// get all invoices 
router.get("/invoice", (req, res) => {
  req.db
    .collection("Drivers")
    .findOne({ email: req.email })
    .then((data) => {
      console.log(data.invoice);
      res.json({ status: "success", result: data.invoice });
    });
});

module.exports = router;
