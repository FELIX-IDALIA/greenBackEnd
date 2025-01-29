// utils/validators.js
const Joi = require("joi");

// Validation schema for creating/updating streams
const streamSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .trim()
        .messages({
            "string.empty": "Stream title is required",
            "string.min": "Stream title must be at least 3 characters long",
            "string.max": "Stream title cannot exceed 100 characters"
        }),

        description: Joi.string()
            .max(1000)
            .allow("")
            .trim()
            .messages({
                "string.max": "Description cannot exceed 1000 characters"
            }),

            tags: Joi.array()
                .items(
                    Joi.string()
                        .min(2)
                        .max(20)
                        .trim()
                )
                .max(10)
                .messages({
                    "array.max": "Cannot add more than 10 tags",
                    "string.min": "Each tag must be at least 2 characters long",
                    "string.max": "Each tag cannot exceed 20 characters"
                }),

                thumbnail: Joi.string()
                    .uri()
                    .allow("")
                    .messages({
                        "string.uri": "Thumbnail must be a valid URL"
                    }),

                scheduledStartTime: Joi.date()
                    .min("now")
                    .messages({
                        "date.min": "Scheduled start time must be in the future"
                    })
                    .allow(null),

                    settings: Joi.object({
                        enableChat: Joi.boolean().default(true),
                        chatDelay: Joi.number().min(0).max(300).default(0),
                        allowedQuality: Joi.array().items(
                            Joi.string().valid("1080p", "720p", "480p", "360p", "240p")
                        ).default(["720p", "480p", "360p"]),
                        isPrivate: Joi.boolean().default(false),
                        allowedDomains: Joi.array().items(Joi.string().domain())
                    }).default({})
});

exports.validateStream = (streamData) => {
    return streamSchema.validate(streamData, {
        abortEarly: false,
        stripUnknown: true,
        error: {
            wrap: {
                label: ""
            }
        }
    });
};

// Validation for stream updates (slightly different rules than creation)
const streamUpdateSchema = streamSchema.fork(
    ["title"], // List of keys to modify
    (schema) => schema.optional() // Make them optional for updates
);

exports.validateStreamUpdate = (updateData) => {
    return streamUpdateSchema.validate(updateData, {
        abortEarly: false,
        stripUnKnown: true,
        errors: {
            wrap: {
                label: ""
            }
        }
    });
};

// Helper function to validate stream Key format
exports.validateStreamKey = (streamKey) => {
    const streamKeySchema = Joi.string()
        .hex()
        .length(40)
        .required()
        .messages({
            "string.hex": "Invalid stream key format",
            "string.length": "Invalid stream key length",
            "any.required": "Stream key is required"
        });

        return streamKeySchema.validate(streamKey);
}