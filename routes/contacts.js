const express = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const Contact = require('../models/Contact');

const router = express.Router();
//all contacts routes require authentication
router.use(auth);

// @route     GET api/contacts
// @desc      Read all users contacts
// @access    Private
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({err: {msg: 'server error'}});
  }
});

// @route     POST api/contacts
// @desc      Create new contact
// @access    Private
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    //check errors from validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ err: result.array() });
    }

    //save to database and send response to client
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({err: {msg: 'server error'}});
    }
  }
);

/**
 * @todo DRY the code by extracting user - contact match
 */
// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put('/:id', async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({err: { msg: "contact doesn't exist" }});
    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(403).json({ err: {msg: 'Not authorized' }});
    }

    //parse the request and build new contact
    const { name, email, phone, type } = req.body;
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    //update in database and send response to client
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({err: {msg: 'server error'}});
  }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/:id', async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({err: { msg: "contact doesn't exist" }});
    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(403).json({err: { msg: 'Not authorized' }});
    }

    await Contact.findByIdAndRemove(req.params.id);
    res.json({err: { msg: 'Contact removed' }});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({err: {msg: 'server error'}});
  }
});

module.exports = router;