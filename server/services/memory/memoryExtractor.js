const extractMemory = async (message, memory) => {
    const lower = message.toLowerCase();
    const extracted = {
        name: memory?.profile?.name || null,
        goal: memory?.profile?.goal || null,
        summary: memory?.summary || null,
    };

    if (!memory?.profile) {
        memory.profile = {};
    }

    if (!memory?.preferences) {
        memory.preferences = {};
    }

    if (lower.includes("my name is")) {
        const name = message.split("is")[1]?.trim();

        if (name) {
            memory.profile.name = name;
            extracted.name = name;
        }
    }

    if (lower.includes("i am preparing for")) {
        const goal = message.split("for")[1]?.trim();

        if (goal) {
            memory.profile.goal = goal;
            extracted.goal = goal;
        }
    }

    if (lower.includes("i like")) {
        const preference = message.split("like")[1]?.trim();

        if (preference) {
            memory.preferences.language = preference;
        }
    }

    if (!memory.summary) {
        const parts = [];

        if (extracted.name) {
            parts.push(`User's name is ${extracted.name}.`);
        }

        if (extracted.goal) {
            parts.push(`User is preparing for ${extracted.goal}.`);
        }

        if (memory.preferences?.language) {
            parts.push(`User likes ${memory.preferences.language}.`);
        }

        memory.summary = parts.join(" ");
        extracted.summary = memory.summary;
    }

    if (typeof memory?.save === "function") {
        await memory.save();
    }

    return extracted;
};

module.exports = extractMemory;