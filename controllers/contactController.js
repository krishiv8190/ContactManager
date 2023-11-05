const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all Contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });

    res.status(200).json(contacts);
});

//@desc create new Contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {
    try {
        console.log("The request body is:", req.body);
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            res.status(400);
            throw new Error("All fields are mandatory !");
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id,
        });
        res.status(201).json(contact);
        console.log("Response sent from createContact");
    } catch (error) {
        console.error("Error in createContact:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//@desc Get Contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(404);
            throw new Error("Contact not found");
        }

        res.status(200).json(contact);
    } catch (error) {
        console.error("Error in createContact:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//@desc Update Contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("user can't update other user's contact");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );
    res.status(200).json(updatedContact);
});

//@desc Delete Contact
//@route DELETE /api/contacts
//@access public

const deleteContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            res.status(404);
            throw new Error("Contact not found");
        }
        if (contact.user_id.toString() !== req.user.id) {
            res.status(403);
            throw new Error("user can't delete other user's contact");
        }
        await Contact.deleteOne({ __id: req.params.id });
        res.status(200).json(contact);
    } catch (error) {
        console.error("Error in createContact:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
