const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get all contacts from 'req.user.id' thanks to the auth token
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
  '/',
  [auth, [body('name', 'name is required').not().isEmpty()]],
  async (req, res) => {
    // if errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // if no errors
    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactsFields = {};
  if (name) {
    contactsFields.name = name;
  }
  if (email) {
    contactsFields.email = email;
  }
  if (phone) {
    contactsFields.phone = phone;
  }
  if (type) {
    contactsFields.type = type;
  }

  try {
    // get contact in DB from id parameter
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(400).json({ msg: 'Contact not found' });
    }

    // Make sur user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // update contact
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactsFields,
      },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // get contact in DB from id parameter
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(400).json({ msg: 'Contact not found' });
    }

    // Make sur user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // delete contact
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Contact remove' });

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
