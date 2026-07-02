const Memory = require("../../models/Memory");

const getMemory = async (userId) => {

    let memory = await Memory.findOne({ user: userId });

    if (!memory) {

        memory = await Memory.create({
            user: userId
        });

    }

    return memory;

};

module.exports = {
    getMemory
};