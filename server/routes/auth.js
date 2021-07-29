const express = require("express");
const router = express.Router();
const jwtManager = require("../JWT/jwtManager");

router.post("/login", (req, res) => {
  console.log(req.body.email);
  req.db
    .collection("Drivers")
    .findOne({ email: req.body.email })
    .then((data) => {
      console.log(data);
      if (data && data.password === req.body.password) {
        const payload = {};
        payload.firstName = data.firstName;
        payload.lastName = data.lastName;
        payload.email = data.email;
        payload.city = data.address.city;
        payload.role = data.role;
        payload.status = data.status;
        payload.routes = data.routes;
        payload.invoice = data.invoioce;
        payload.gender = data.gender;
        payload.address = data.address.address;
        payload.state = data.address.state;
        const token = jwtManager.generate(payload);
        res.json({ status: "success", result: token, role: data.role });
      }
    })
    .catch((err) => {
      res.json({ status: "error", result: err });
    });
});

router.post("/admin/login", (req, res) => {
  console.log(req.body.email);
  req.db
    .collection("Admin")
    .findOne({ email: req.body.email })
    .then((data) => {
      console.log(data);
      if (data && data.password === req.body.password) {
        const payload = {};
        payload.name = data.name;
        payload.email = data.email;
        payload.role = data.role;
        const token = jwtManager.generate(payload);
        res.json({ status: "success", result: token });
      }
    })
    .catch((err) => {
      res.json({ status: "error", result: err });
    });
});

router.post("/signup", (req, res) => {
  req.db
    .collection("Drivers")
    .findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        res.json({ status: "user already exists" });
      } else {
        let form = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          driverId: req.body.driverId,
          address: {
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
          },
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender,
          status: "inActive",
          role: "driver",
          routes: [],
          invoice: [],
        };
        req.db
          .collection("Drivers")
          .insertOne(form)
          .then((data) => {
            res.status(200).json({ status: "success", result: data });
          });
      }
    });
});

module.exports = router;
