const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js") 


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,

        // default: // Handles cases where the image field is completely omitted in the input. Without a default, the field would be undefined.
        // "https://unsplash.com/photos/brown-wooden-house-in-the-middle-of-forest-during-daytime-jo8pclRHmCI",
        
        // set: (v) => // Handles cases where the image field is provided but is set to an empty string intentionally.
        //     v === "" 
        //      ? "https://unsplash.com/photos/brown-wooden-house-in-the-middle-of-forest-during-daytime-jo8pclRHmCI" 
        //      : v, 
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" // using review model as reference
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User" // using user model as reference
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;




/** set: (v) => v === "" ? "default link" : v,
 * ============================================================================================================================================
 * Function Declaration:
    The setter is defined as a function (v) => v === "" ? "default link" : v.
    v is the value being set for the image field.

 * Conditional Check:
    v === "": This checks if the incoming value v is an empty string.
    If the condition is true (i.e., if the image field is assigned an empty string), the function returns "default link".

 * Default Value:
    "default link" acts as a default value for the image field if it is not provided by the user or if it is an empty string.

 * Return Original Value:
    If the incoming value is not an empty string, the function returns v as it is.
    This means that if the image field is provided with a valid string, that value will be stored without any modification.

 */


/** Why Both `default` and `set` Are Necessary
 * ============================================================================================================================================
 * `default`: Handles cases where the image field is completely omitted in the input. Without a default, the field would be undefined.
 * When Field is Omitted:
    const listing1 = new Listing({
    title: "Cozy Cabin",
    description: "A small cabin in the woods.",
    price: 150000,
    location: "Mountain View",
    country: "USA"
    // image field is omitted
    });
    console.log(listing1.image); // Outputs: "https://unsplash.com/photos/brown-wooden-house-in-the-middle-of-forest-during-daytime-jo8pclRHmCI"

 * `set`: Handles cases where the image field is provided but is set to an empty string intentionally.
 * When Field is Explicitly Set to an Empty String:
    const listing2 = new Listing({
    title: "Modern Apartment",
    description: "An apartment in the city.",
    image: "", // Empty string provided
    price: 250000,
    location: "Downtown",
    country: "USA"
    });
    console.log(listing2.image); // Outputs: "https://unsplash.com/photos/brown-wooden-house-in-the-middle-of-forest-during-daytime-jo8pclRHmCI"

 */