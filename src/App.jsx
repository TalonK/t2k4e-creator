import React, { useState, useEffect, useMemo } from 'react';

// ===================================================================================
// --- GAME DATA ---
// All static data from the rulebook is centralized here for easy maintenance.
// In a larger project, this would be in its own file (e.g., `gameData.js`).
// ===================================================================================

const gameData = {
    SKILLS_DATA: {
        "Close Combat": "str", "Heavy Weapons": "str", "Stamina": "str",
        "Driving": "agl", "Mobility": "agl", "Ranged Combat": "agl",
        "Recon": "int", "Survival": "int", "Tech": "int",
        "Command": "emp", "Medical Aid": "emp", "Persuasion": "emp"
    },
    SKILL_DESCRIPTIONS: {
        "Close Combat": "Use when fighting an enemy up close and personal, with or without a melee weapon.",
        "Heavy Weapons": "Use to fire machine guns, rocket launchers, mortars, and other heavy weapons.",
        "Stamina": "Use when your physical toughness or endurance is tested, like marching hard or resisting disease.",
        "Driving": "Use to maneuver motorcycles, cars, APCs, and even tanks.",
        "Mobility": "Use when you jump, climb, run fast, or perform any other action requiring speed or motor control.",
        "Ranged Combat": "Use for hand-held ranged weapons like pistols, bows, and assault rifles.",
        "Recon": "Use to spot concealed enemies, avoid ambushes, and move silently.",
        "Survival": "Use to find food and shelter in the wild.",
        "Tech": "Use to repair gear, scavenge for parts, and craft new items.",
        "Command": "Use to rally a person incapacitated by stress and to manage your unit.",
        "Medical Aid": "Use to treat the injured and save the dying.",
        "Persuasion": "Use charm, threats, or reason to make others see things your way."
    },
    ALL_SPECIALTIES: [
        "Archer", "Authority", "Biker", "Blacksmith", "Boatman", "Brawler", "Builder", "Chemist", "Close Quarters Specialist", "Combat Awareness", "Combat Engineer", "Combat Medic", "Communications", "Computers", "Cook", "Counselor", "Cryptographer", "Diver", "Electrician", "Farmer", "Field Surgeon", "Fisher", "Forager", "Forward Observer", "Frontline Leader", "General Practitioner", "Gunsmith", "Historian", "Hunter", "Improvised Munitions", "Infiltrator", "Intelligence", "Interrogator", "Investigator", "Killer", "Launcher Crew", "Liar", "Linguist", "Load Carrier", "Locksmith", "Logistician", "Machinegunner", "Martial Artist", "Mechanic", "Melee", "Mountaineer", "Musician", "Navigator", "NBC", "Paratrooper", "Pilot", "Pitcher", "Psy Ops", "Quartermaster", "Racer", "Ranger", "Redleg", "Reloader", "Rider", "Rifleman", "Runner", "Scientist", "Scout", "Scrounger", "SERE Training", "Sidearms", "Sniper", "Tactician", "Tanker", "Teacher", "Thief", "Trader", "Vehicle Gunner", "Veterinarian"
    ],
    SPECIALTY_DESCRIPTIONS: {
        "Brawler": "Gives you a +1 modifier to CLOSE COMBAT rolls in unarmed close combat.", "Melee": "Gives you a +1 modifier to CLOSE COMBAT rolls for all hand-to-hand combat weapons, such as knives, bayonets, and clubs.", "Killer": "You can kill an incapacitated person outright without suffering any negative effects.", "Martial Artist": "Your unarmed close combat attacks have a crit threshold of 3 instead of 4.", "Machinegunner": "Gives a +1 modifier to HEAVY WEAPONS rolls for firing all types of machine guns.", "Launcher Crew": "Gives a +1 modifier to HEAVY WEAPONS rolls for firing grenade launchers and missile launchers.", "Redleg": "Gives a +1 modifier to HEAVY WEAPONS rolls when firing mortars and howitzers.", "Vehicle Gunner": "Gives a +1 modifier to HEAVY WEAPONS rolls when firing vehicle-mounted cannons.", "Builder": "Gives you a +1 modifier to STAMINA rolls made for base building.", "Load Carrier": "You can carry four additional encumbrance units in your combat gear and four more in your backpack.", "NBC": "Gives a +1 modifier to STAMINA for all infection rolls, even those triggered by radiation or chemical agents. Also lets you identify nuclear, biological, and chemical weapon effects to personnel and equipment.", "Ranger": "Gives you a +1 modifier to STAMINA rolls made for marching, resisting hypothermia, and other hardships.", "SERE Training": "Gives you a +1 modifier to STAMINA rolls made to resist interrogation, Psy Ops, bluffing, and torture effects.", "Biker": "Gives a +1 modifier to DRIVING all motorcycles and bicycles, on or off-road.", "Boatman": "Gives a +1 modifier to DRIVING rolls for piloting boats, including sail and rowed boats.", "Pilot": "Gives a +1 modifier to DRIVING rolls for flying fixed-and rotary-wing aircraft.", "Racer": "Gives a +1 modifier to DRIVING all wheeled vehicles except motorcycles.", "Tanker": "Gives a +1 modifier to DRIVING all tracked vehicles.", "Diver": "Gives a +1 bonus to MOBILITY rolls when swimming, both across the surface and under it. Includes use of SCUBA gear.", "Mountaineer": "Gives a +1 bonus to MOBILITY rolls for rappelling, ascender-climbing, and knot-tying.", "Paratrooper": "Gives a +1 bonus to MOBILITY rolls for skydiving, as well as for reducing damage from falling.", "Pitcher": "Gives a +1 modifier to MOBILITY rolls for thrown weapons, including knives and grenades.", "Rider": "Gives a +1 bonus to MOBILITY rolls for riding fast and performing maneuvers on horseback. Also negates the negative modifier for shooting from horseback.", "Runner": "Gives a +1 bonus to MOBILITY rolls for running.", "Archer": "Gives a +1 modifier to RANGED COMBAT rolls for bows and crossbows.", "Reloader": "Gives a +1 modifier to RANGED COMBAT rolls made to reload your firearm.", "Rifleman": "Gives a +1 modifier to RANGED COMBAT rolls for firing assault rifles, carbines, submachine guns, and shotguns.", "Sidearms": "Gives a +1 modifier to RANGED COMBAT rolls for firing revolvers and pistols.", "Sniper": "Gives a +1 modifier to RANGED COMBAT rolls for firing sniper rifles and hunting rifles.", "Combat Awareness": "When drawing initiative, you may draw two cards instead of one and choose which one to act on.", "Forward Observer": "Your RECON skill level counts as one step higher when directing indirect fire.", "Historian": "Roll RECON when you arrive at a new location. If you succeed, the Referee can tell you something significant that has happened here in the past.", "Infiltrator": "Gives you a +1 modifier to RECON rolls when trying to remain undetected.", "Intelligence": "Roll RECON when you spot enemy troops, vehicles, and weapons. If you succeed, the Referee should tell you their stats.", "Investigator": "Roll RECON when you spend a stretch or more investigating the scene of a crime or a battle. If you succeed, the Referee should give you some useful information.", "Scout": "Gives you a +1 modifier to RECON rolls for spotting others and avoiding ambushes.", "Cook": "Gives you one additional ration of food when you or someone else in your group successfully forages, hunts or fishes.", "Farmer": "Gives a +1 modifier to SURVIVAL rolls for farming.", "Fisher": "Gives a +1 modifier to SURVIVAL rolls for fishing.", "Forager": "Gives a +1 modifier to SURVIVAL rolls for foraging to find food.", "Navigator": "Gives a +1 modifier when using SURVIVAL rolls for navigation.", "Hunter": "Gives a +1 modifier to SURVIVAL rolls for hunting to obtain food.", "Quartermaster": "Gives you a +1 modifier to SURVIVAL rolls for making camp and establishing a home base.", "Scrounger": "Gives a +1 modifier to SURVIVAL rolls for scrounging.", "Blacksmith": "Gives a +1 modifier to TECH rolls for metalworking, forging, casting, molding, and smelting.", "Chemist": "Gives a +1 modifier to TECH rolls for distilling grain alcohol for fuel. Also lets you identify chemical substances correctly.", "Combat Engineer": "Gives a +1 modifier to TECH rolls for placing and disarming mines and explosive devices, and to RECON rolls to avoid mines.", "Communications": "Gives a +1 modifier to TECH rolls for maintaining contact on radios, boosting a signal, using Morse code, setting up antennae, and using encryption equipment.", "Computers": "Gives a +1 modifier to TECH rolls for using or tampering with computers and ancillary devices.", "Electrician": "Gives a +1 modifier to TECH rolls for wiring, soldering, disabling, and repairing electrical devices.", "Gunsmith": "Gives a +1 modifier to TECH rolls for repairing firearms.", "Improvised Munitions": "Gives a +1 modifier to TECH rolls for making zip-guns and IEDs.", "Locksmith": "Gives a +1 modifier to TECH rolls for picking locks, cracking safes, and disarming alarms.", "Mechanic": "Gives a +1 modifier to TECH rolls for repairing engines, vehicles, generators, and pumps.", "Scientist": "Roll TECH when you come across a phenomenon of any sort that requires knowledge of physics, biology, geology, or any other natural science. If you succeed, the Referee must give you some useful information about it.", "Frontline Leader": "Gives a +1 bonus to COMMAND rolls for helping someone who is incapacitated by stress. Does not affect unit morale.", "Logistician": "When building a base, you can roll COMMAND instead of any listed skill, but only if you have help by at least one person.", "Tactician": "Roll COMMAND when you spot an enemy force. If you succeed, the Referee must tell you something useful about their current organization and objectives.", "Combat Medic": "Gives a +1 modifier to MEDICAL AID rolls for helping an incapacitated character get back up. No effect on treating critical injuries.", "Counselor": "Gives a +1 modifier to MEDICAL AID rolls for counseling a person suffering from long-term mental trauma.", "Field Surgeon": "Gives a +1 modifier to MEDICAL AID rolls for treating critical injuries.", "General Practitioner": "Gives a +1 modifier to MEDICAL AID rolls for treating disease, poison, and NBC.", "Veterinarian": "Gives a +1 modifier to MEDICAL AID rolls for working on animals.", "Linguist": "You know another language of your choice, well enough to be taken as native on a successful PERSUASION roll.", "Musician": "Gives a +1 bonus to PERSUASION rolls in situations where singing or playing an instrument is helpful. The Referee has final say.", "Interrogator": "Gives a +1 bonus to PERSUASION rolls for extracting information from a prisoner.", "Psy Ops": "Gives a +1 bonus to PERSUASION rolls for changing someone's mind about a particular issue.", "Teacher": "Gives a +1 bonus to PERSUASION rolls for teaching someone a specialty.", "Trader": "Gives a +1 bonus to PERSUASION rolls when negotiating the price of an item.",
        "Authority": "You can roll COMMAND to calm down a rowdy crowd. This specialty cannot be used on hostile enemies.",
        "Close Quarters Specialist": "The penalty for shooting in close combat is reduced one step.",
        "Cryptographer": "Gives a +1 bonus to any TECH roll involving breaking or creating encrypted messages and codes.",
        "Liar": "Gives a +1 bonus to any PERSUASION roll when lying to someone.",
        "Thief": "Gives a +1 bonus to RECON rolls when picking pockets and TECH rolls when picking locks."
    },
    ATTRIBUTE_DICE: { A: 'D12', B: 'D10', C: 'D8', D: 'D6' },
    DIE_SIZES: { D12: 12, D10: 10, D8: 8, D6: 6 },
    US_ARMY_RANKS: ["Private", "Private First Class", "Corporal", "Sergeant", "Staff Sergeant", "Sergeant First Class", "Master Sergeant", "First Sergeant", "Sergeant Major", "Second Lieutenant", "First Lieutenant", "Captain", "Major", "Lieutenant Colonel", "Colonel"],
    CHILDHOODS: {
        "Street Kid": { skills: ["Close Combat", "Mobility", "Recon"], specialties: ["Brawler", "Melee", "Runner", "Infiltrator", "Scrounger", "Locksmith"] },
        "Small Town": { skills: ["Driving", "Ranged Combat", "Survival"], specialties: ["Biker", "Racer", "Sniper", "Farmer", "Hunter", "Quartermaster"] },
        "Working Class": { skills: ["Close Combat", "Stamina", "Tech"], specialties: ["Brawler", "Builder", "Load Carrier", "Scrounger", "Blacksmith", "Mechanic"] },
        "Intellectual": { skills: ["Tech", "Medical Aid", "Persuasion"], specialties: ["Historian", "Communications", "Computers", "Scientist", "Linguist", "Musician"] },
        "Military Family": { skills: ["Stamina", "Mobility", "Ranged Combat"], specialties: ["Brawler", "Martial Artist", "Ranger", "Mountaineer", "Runner", "Rifleman"] },
        "Affluence": { skills: ["Mobility", "Command", "Persuasion"], specialties: ["Boatman", "Rider", "Runner", "Linguist", "Musician", "Trader"] }
    },
    CAREERS_DATA: {
        "combat_arms": { name: "Combat Arms", type: "military", group: "Military", skills: ["Close Combat", "Heavy Weapons", "Ranged Combat", "Recon"], specialties: ["Rifleman", "Redleg", "Tanker", "Machinegunner", "Launcher Crew", "Combat Engineer"], gear: ["Assault rifle, LMG or ATRL", "D6 reloads", "Flak jacket and helmet", "Knife or D6 hand grenades", "Personal medkit", "Backpack"], startRank: "Private" },
        "combat_support": { name: "Combat Support", type: "military", group: "Military", skills: ["Recon", "Survival", "Tech"], specialties: ["Intelligence", "Linguist", "Communications", "NBC", "Psy Ops", "Interrogator"], gear: ["Assault rifle", "D6 reloads", "Flak jacket and helmet", "Knife or D6 hand grenades", "Personal medkit", "MOPP suit or manpack radio", "Backpack"], startRank: "Private First Class" },
        "combat_service_support": { name: "Combat Service Support", type: "military", group: "Military", skills: ["Medical Aid", "Tech"], specialties: ["Mechanic", "Gunsmith", "Electrician", "Computers", "Combat Medic", "Field Surgeon"], gear: ["Assault rifle", "D6 reloads", "Flak jacket and helmet", "Knife or D6 hand grenades", "Personal medkit", "Basic tools", "Vehicle tools or weapon tools or surgical instruments", "Backpack"], startRank: "Private First Class" },
        "special_ops": { name: "Special Operations", type: "military", group: "Military", skills: ["Close Combat", "Ranged Combat", "Recon", "Survival"], specialties: ["Paratrooper", "Ranger", "Infiltrator", "Combat Awareness", "Sniper", "SERE Training"], gear: ["Assault rifle or sniper rifle", "Any pistol or D6 hand grenades or rifle-mounted grenade launcher", "D6 reloads for each weapon", "Binoculars or night vision goggles", "Flak jacket and helmet", "Knife", "Personal medkit", "Backpack"], startRank: "Sergeant" },
        "officer": { name: "Officer", type: "military", group: "Military", skills: ["Ranged Combat", "Command", "Persuasion"], specialties: ["Sidearms", "Intelligence", "Tactician", "Logistician", "Frontline Leader", "Quartermaster"], gear: ["Pistol or submachine gun", "D6 reloads", "Manpack radio or night vision goggles", "Flak jacket", "Knife or D6 hand grenades", "Personal medkit"], startRank: "Second Lieutenant" },
        "police_officer": { name: "Police Officer", type: "civilian", group: "Police", skills: ["Close Combat", "Ranged Combat"], specialties: ["Sidearms", "Melee", "Runner", "Racer", "Biker", "Scout"], gear: ["Pistol", "D6 reloads", "Baton (club)", "Handcuffs", "Patrol car"] },
        "detective": { name: "Detective", type: "civilian", group: "Police", skills: ["Ranged Combat", "Recon", "Persuasion"], specialties: ["Infiltrator", "Interrogator", "Intelligence", "Investigator", "Locksmith", "Linguist"], gear: ["Pistol", "D6 reloads", "Lockpicks"] },
        "swat": { name: "SWAT", type: "civilian", group: "Police", skills: ["Close Combat", "Ranged Combat", "Recon"], specialties: ["Martial Artist", "Rifleman", "Sniper", "Combat Awareness", "Infiltrator", "Scout"], gear: ["Assault rifle or submachinegun", "D6 reloads", "Flak jacket and helmet", "Night vision goggles", "Knife", "Personal medkit"] },
        "gang_member": { name: "Gang Member", type: "civilian", group: "Crime", skills: ["Close Combat", "Ranged Combat"], specialties: ["Brawler", "Melee", "Killer", "Martial Artist", "Rifleman", "Sidearms"], gear: ["Any civilian firearm", "D6 reloads", "Knife"] },
        "burglar": { name: "Burglar", type: "civilian", group: "Crime", skills: ["Recon"], specialties: ["Brawler", "Sidearms", "Mountaineer", "Infiltrator", "Electrician", "Locksmith"], gear: ["Pistol or revolver", "D6 reloads", "Lockpick set"] },
        "hustler": { name: "Hustler", type: "civilian", group: "Crime", skills: ["Recon", "Persuasion"], specialties: ["Sidearms", "Infiltrator", "Scout", "Interrogator", "Psy Ops", "Trader"], gear: ["Pistol or revolver", "D6 reloads"] },
        "prisoner": { name: "Prisoner", type: "civilian", group: "Crime", skills: ["Close Combat"], specialties: ["Brawler", "Melee", "Killer", "Ranger", "SERE Training", "Scrounger"], gear: ["Any civilian firearm", "D6 reloads", "Knife"] },
        "agent": { name: "Agent", type: "civilian", group: "Intelligence", skills: ["Ranged Combat", "Recon", "Persuasion"], specialties: ["Intelligence", "Locksmith", "Investigator", "Scout", "Psy Ops", "Sidearms"], gear: ["Pistol", "D6 reloads", "Lockpick set", "Knife or explosives", "Personal medkit"] },
        "assassin": { name: "Assassin", type: "civilian", group: "Intelligence", skills: ["Close Combat", "Ranged Combat"], specialties: ["Killer", "Interrogator", "Sniper", "Martial Artist", "Improvised Munitions", "Infiltrator"], gear: ["Sniper rifle or suppressed submachinegun", "D6 reloads", "Radio or binoculars", "Knife or explosives", "Personal medkit"] },
        "paramilitary": { name: "Paramilitary", type: "civilian", group: "Intelligence", skills: ["Heavy Weapons", "Ranged Combat", "Survival"], specialties: ["Brawler", "Rifleman", "Machinegunner", "Combat Engineer", "Improvised Munitions", "Tactician"], gear: ["Assault rifle, LMG or ATRL", "D6 reloads", "Knife or D6 hand grenades", "Personal medkit"] },
        "driver": { name: "Driver", type: "civilian", group: "Blue Collar", skills: ["Tech"], specialties: ["Biker", "Boatman", "Navigator", "Pilot", "Racer", "Tanker"], gear: ["Any civilian firearm", "D3 reloads", "Any civilian car or truck", "Vehicle tools"] },
        "farmer": { name: "Farmer", type: "civilian", group: "Blue Collar", skills: ["Survival"], specialties: ["Cook", "Farmer", "Fisher", "Hunter", "Forager", "Rider"], gear: ["Any civilian firearm", "D3 reloads", "Pickup truck", "Basic toolkit", "2D6 rations of food"] },
        "mechanic": { name: "Mechanic", type: "civilian", group: "Blue Collar", skills: ["Tech"], specialties: ["Blacksmith", "Gunsmith", "Locksmith", "Mechanic", "Scrounger", "Improvised Munitions"], gear: ["Any civilian firearm", "D3 reloads", "Pickup truck", "Basic tools", "Vehicle tools or weapon tools"] },
        "construction": { name: "Construction", type: "civilian", group: "Blue Collar", skills: ["Close Combat", "Tech"], specialties: ["Brawler", "Builder", "Load Carrier", "Blacksmith", "Electrician", "Improvised Munitions"], gear: ["Any civilian firearm", "D3 reloads", "Crowbar", "Pickup truck", "Basic tools"] },
        "liberal_arts": { name: "Liberal Arts", type: "civilian", group: "Education", skills: ["Persuasion"], specialties: ["Historian", "Cook", "Linguist", "Musician", "Psy Ops", "Counselor"], gear: ["Any civilian firearm", "D3 reloads", "Dictionary in any language", "Bicycle"] },
        "sciences": { name: "Sciences", type: "civilian", group: "Education", skills: ["Tech"], specialties: ["Chemist", "Communication", "Computers", "Electrician", "Scientist", "Linguist"], gear: ["Any civilian firearm", "D3 reloads", "Bicycle or 2WD car with half a tank of gasoline"] },
        "doctor": { name: "Doctor", type: "civilian", group: "White Collar", skills: ["Medical Aid", "Persuasion"], specialties: ["Linguist", "Combat Medic", "Counselor", "Field Surgeon", "General Practitioner", "Veterinarian"], gear: ["Any civilian firearm", "D3 reloads", "D6 personal medkits", "Pain relievers", "Surgical instruments"] },
        "professor": { name: "Professor", type: "civilian", group: "White Collar", skills: ["Persuasion"], specialties: ["Historian", "Chemist", "Scientist", "Linguist", "Psy Ops", "Teacher"], gear: ["Any civilian firearm", "D3 reloads", "2WD car with half a tank of gasoline"] },
        "manager": { name: "Manager", type: "civilian", group: "White Collar", skills: ["Tech", "Command", "Persuasion"], specialties: ["Quartermaster", "Computers", "Frontline Leader", "Logistician", "Teacher", "Counselor"], gear: ["Any civilian firearm", "D3 reloads", "2WD car with half a tank of gasoline", "Pocket calculator"] }
    },
    CAREER_REQUIREMENTS: {
        "combat_arms": (attrs) => attrs.str <= 'B' || attrs.agl <= 'B', "combat_support": (attrs) => attrs.int <= 'B', "combat_service_support": () => true, "special_ops": (attrs, terms) => (attrs.str <= 'B' && attrs.agl <= 'B' && attrs.int <= 'C' && terms.some(t => t.career.name === 'Combat Arms' || (t.career.name === 'Officer' && t.functionalArea === 'Combat Arms'))), "officer": (attrs, terms) => (attrs.int <= 'B' && !Object.values(attrs).includes('D') && terms.some(t => t.career.group === 'Education')), "police_officer": (attrs, terms) => !Object.values(attrs).includes('D') && !terms.some(t => t.career.name === 'Prisoner'), "detective": (attrs, terms) => attrs.emp <= 'B' && terms.some(t => t.career.name === 'Police Officer'), "swat": (attrs, terms) => attrs.str <= 'B' && attrs.agl <= 'B' && terms.some(t => t.career.name === 'Police Officer'), "gang_member": (attrs) => attrs.str <= 'C' && attrs.agl <= 'C', "burglar": (attrs) => attrs.agl <= 'C' && attrs.int <= 'C', "hustler": (attrs) => attrs.int <= 'C' && attrs.emp <= 'C', "prisoner": () => true, "agent": (attrs, terms) => attrs.int <= 'B' && terms.some(t => t.career.group === 'Education'), "assassin": (attrs, terms) => (attrs.emp >= 'C' && attrs.agl <= 'B' && terms.some(t => t.career.name === 'Agent')), "paramilitary": (attrs, terms) => attrs.str <= 'B' && attrs.agl <= 'B' && terms.some(t => t.career.type === 'military'), "driver": (attrs) => attrs.agl <= 'B', "farmer": () => true, "mechanic": () => true, "construction": (attrs) => attrs.str <= 'B', "liberal_arts": (attrs) => attrs.int <= 'C' && attrs.emp <= 'C', "sciences": (attrs) => attrs.int <= 'B', "doctor": (attrs, terms) => attrs.emp <= 'B' && terms.filter(t => t.career.name === 'Sciences').length >= 2, "professor": (attrs, terms) => attrs.int <= 'B' && terms.filter(t => t.career.name === 'Liberal Arts').length >= 2, "manager": (attrs, terms) => attrs.emp <= 'B' && terms.some(t => t.career.group === 'Education')
    },
    AT_WAR_SPECIALTIES: {
        "Military": ["Brawler", "Ranger", "NBC", "Rifleman", "Scrounger", "Improvised Munitions"],
        "Blue Collar": ["Brawler", "Rider", "Runner", "Quartermaster", "Gunsmith", "Mechanic"],
        "White Collar": ["Scout", "Fisher", "Forager", "Scrounger", "Frontline Leader", "Interrogator"],
        "Other": ["Racer", "Hunter", "Forager", "Quartermaster", "Scrounger", "Improvised Munitions"]
    }
};

// ===================================================================================
// --- HELPER FUNCTIONS ---
// Small, reusable functions for dice rolling and calculations.
// ===================================================================================

const d6 = () => Math.floor(Math.random() * 6) + 1;
const d8 = () => Math.floor(Math.random() * 8) + 1;
const twoD3 = () => {
    const r1 = Math.floor(Math.random() * 3) + 1;
    const r2 = Math.floor(Math.random() * 3) + 1;
    return { rolls: [r1, r2], total: r1 + r2 };
};

const rollCheck = (attrDie, skillDie) => {
    if (!attrDie) return { success: false, attrDie: 'None', skillDie: skillDie || 'None', attrRoll: 0, skillRoll: 0 };
    const attrRoll = Math.floor(Math.random() * gameData.DIE_SIZES[attrDie]) + 1;
    const skillRoll = skillDie ? Math.floor(Math.random() * gameData.DIE_SIZES[skillDie]) + 1 : 0;
    return {
        success: attrRoll >= 6 || skillRoll >= 6,
        attrDie,
        skillDie: skillDie || 'None',
        attrRoll,
        skillRoll
    };
};
const getDie = (level) => level ? gameData.ATTRIBUTE_DICE[level] : null;

const generateCharacterSheetText = (character) => {
    let text = `TWILIGHT:2000 CHARACTER SHEET\n`;
    text += `===================================\n\n`;
    text += `Name: ${character.name}\n`;
    text += `Nationality: ${character.nationality}\n`;
    text += `Age: ${character.age}\n\n`;

    text += `--- COMBAT STATS ---\n`;
    text += `Hit Capacity: ${character.hitCapacity}\n`;
    text += `Stress Capacity: ${character.stressCapacity}\n`;
    text += `Coolness Under Fire (CUF): ${character.cuf}\n`;
    if (character.rank) text += `Rank: ${character.rank}\n`;
    text += `Permanent Rads: ${character.rads}\n\n`;

    text += `--- ATTRIBUTES & SKILLS ---\n`;
    const columnWidth = 40;
    const attrPairs = [['str', 'agl'], ['int', 'emp']];

    attrPairs.forEach(pair => {
        const [leftAttrKey, rightAttrKey] = pair;
        
        const leftLines = [];
        const rightLines = [];

        leftLines.push(`${leftAttrKey.toUpperCase()}: ${character.attributes[leftAttrKey]} (${gameData.ATTRIBUTE_DICE[character.attributes[leftAttrKey]]})`);
        Object.entries(gameData.SKILLS_DATA).filter(([_, attr]) => attr === leftAttrKey).forEach(([skillName, _]) => {
            const skillLevel = character.skills[skillName] || '-';
            const skillDie = skillLevel !== '-' ? ` (${gameData.ATTRIBUTE_DICE[skillLevel]})` : '';
            leftLines.push(`  ${skillName}: ${skillLevel}${skillDie}`);
        });

        if (rightAttrKey) {
            rightLines.push(`${rightAttrKey.toUpperCase()}: ${character.attributes[rightAttrKey]} (${gameData.ATTRIBUTE_DICE[character.attributes[rightAttrKey]]})`);
            Object.entries(gameData.SKILLS_DATA).filter(([_, attr]) => attr === rightAttrKey).forEach(([skillName, _]) => {
                const skillLevel = character.skills[skillName] || '-';
                const skillDie = skillLevel !== '-' ? ` (${gameData.ATTRIBUTE_DICE[skillLevel]})` : '';
                rightLines.push(`  ${skillName}: ${skillLevel}${skillDie}`);
            });
        }

        const maxLines = Math.max(leftLines.length, rightLines.length);
        for (let i = 0; i < maxLines; i++) {
            const leftLine = leftLines[i] || '';
            const rightLine = rightLines[i] || '';
            text += `${leftLine.padEnd(columnWidth)}${rightLine}\n`;
        }
        text += `\n`;
    });

    text += `--- SPECIALTIES ---\n`;
    const specialtiesString = character.specialties.join(', ');
    const maxLineWidth = columnWidth * 2;
    let currentLine = '';
    const words = specialtiesString.split(' ');
    for (const word of words) {
        if ((currentLine + word).length > maxLineWidth) {
            text += `${currentLine.trim()}\n`;
            currentLine = '';
        }
        currentLine += `${word} `;
    }
    text += `${currentLine.trim()}\n\n`;


    text += `--- GEAR ---\n`;
    character.gear.forEach(item => text += `- ${item}\n`);
    text += `- D6 rations of food and water, D6 rounds of ammo\n\n`;

    text += `--- CAREER PATH ---\n`;
    character.careerPath.forEach((term, i) => {
        let label = `Term ${i}`;
        if (term.career.type === 'Childhood') label = 'Childhood';
        else if (term.career.name === 'At War') label = 'At War';
        
        let careerName = term.career.name;
        if (term.career.name === 'Officer' && term.functionalArea) {
            careerName = `Officer [${term.functionalArea}]`;
        } else if (term.career.name === 'At War') {
             careerName = '';
        }

        text += `${label}: ${careerName ? `${careerName} ` : ''}(${term.skillsIncreased.join(', ')}) ${term.specialtyGained ? `-> ${term.specialtyGained}` : ''}\n`;
    });

    return text;
};


const initialCharacter = {
    name: '', nationality: '', age: 18, cuf: 'D', rank: null, isLocal: false,
    attributes: { str: 'C', agl: 'C', int: 'C', emp: 'C' },
    skills: {}, specialties: [], careerPath: [], gear: [],
    rads: 0,
    termsCompleted: 0, warBrokeOut: false, finalCareer: null,
    hitCapacity: 0, stressCapacity: 0,
    hasMilitaryService: false
};

// ===================================================================================
// --- UI COMPONENTS ---
// Reusable presentational components.
// In a larger project, these would be in their own files (e.g., `components/UI.js`).
// ===================================================================================

const Card = ({ children, className = '' }) => (
    <div className={`bg-black/50 border border-zinc-700 p-6 shadow-lg backdrop-blur-sm ${className}`}>
        {children}
    </div>
);

const Button = ({ onClick, children, disabled = false, className = '', title = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 font-bold uppercase tracking-wider transition-colors duration-200 ${
            disabled ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-zinc-900'
        } ${className}`}
        title={title}
    >
        {children}
    </button>
);

const Input = ({ value, onChange, placeholder, className = '' }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-zinc-700 border border-zinc-600 p-2 text-yellow-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
    />
);

const Select = ({ value, onChange, options, placeholder, disabled = false, descriptions = {} }) => (
    <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-zinc-700 border border-zinc-600 p-2 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
                <option key={val} value={val} title={descriptions[val]}>
                    {label}
                </option>
            );
        })}
    </select>
);

// ===================================================================================
// --- LAYOUT COMPONENTS ---
// ===================================================================================

const CharacterStatus = ({ character, skillPreview }) => (
    <Card className="mb-6">
        <h3 className="text-xl font-display border-b border-zinc-600 mb-2 text-yellow-400">CHARACTER STATUS</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-bold text-lg font-display text-yellow-500">Attributes</h4>
                 <div className="grid grid-cols-2 gap-2">
                    {Object.entries(character.attributes).map(([key, val]) => <p key={key}><span className="font-bold uppercase">{key}:</span> {val} ({gameData.ATTRIBUTE_DICE[val]})</p>)}
                </div>
                <p className="mt-2"><span className="font-bold">CUF:</span> {character.cuf}</p>
                {character.rank && <p><span className="font-bold">Rank:</span> {character.rank}</p>}
            </div>
            <div>
                <h4 className="font-bold text-lg font-display text-yellow-500">Skills</h4>
                <div className="grid grid-cols-2 gap-x-4">
                    {['str', 'agl', 'int', 'emp'].map(attrKey => {
                        const skillsForAttr = Object.entries(skillPreview).filter(([skillName, _]) => gameData.SKILLS_DATA[skillName] === attrKey);
                        if (skillsForAttr.length === 0) return <div key={attrKey}></div>;
                        return (
                            <div key={attrKey}>
                                <h5 className="font-semibold mt-2 uppercase text-yellow-500">{attrKey}</h5>
                                {skillsForAttr.sort().map(([skillName, skillLevel]) => (
                                    <p key={skillName} className="text-sm" title={gameData.SKILL_DESCRIPTIONS[skillName]}>
                                        <span className="font-bold">{skillName}:</span> {skillLevel} ({gameData.ATTRIBUTE_DICE[skillLevel]})
                                    </p>
                                ))}
                            </div>
                        );
                    })}
                </div>
                 {Object.keys(skillPreview).length === 0 && <p className="text-zinc-400">None</p>}
            </div>
            <div>
                <h4 className="font-bold text-lg font-display text-yellow-500">Specialties</h4>
                {character.specialties.length > 0 ? (
                    <p className="text-sm text-zinc-300">
                        {character.specialties.map((spec, index) => (
                            <span key={index} title={gameData.SPECIALTY_DESCRIPTIONS[spec.split(' (')[0]]}>
                                {spec}{index < character.specialties.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                ) : <p className="text-zinc-400">None</p>}
            </div>
        </div>
    </Card>
);


// ===================================================================================
// --- STEP COMPONENTS ---
// Each component represents a step in the character creation process.
// ===================================================================================

const Step1_InitialSetup = ({ character, setCharacter, setAttributeIncreases, attributeIncreases, nextStep }) => {
    const handleAttrChange = (attr, direction) => {
        const currentVal = character.attributes[attr].charCodeAt(0);
        let newVal;

        if (direction === 'increase') {
            if (character.attributes[attr] === 'A' || attributeIncreases.total <= 0) return;
            newVal = String.fromCharCode(currentVal - 1);
            setAttributeIncreases(prev => ({ ...prev, total: prev.total - 1 }));
        } else { // 'decrease'
            if (character.attributes[attr] === 'D') return;
            newVal = String.fromCharCode(currentVal + 1);
            setAttributeIncreases(prev => ({ ...prev, total: prev.total + 1 }));
        }

        setCharacter(prev => ({ ...prev, attributes: { ...prev.attributes, [attr]: newVal } }));
    };

    const tradeForIncrease = () => {
        if (Object.values(character.attributes).includes('D')) return;
        
        const cAttribute = Object.keys(character.attributes).find(key => character.attributes[key] === 'C');
        if (cAttribute) {
            handleAttrChange(cAttribute, 'decrease');
        }
    };

    return (
        <Card>
            <h2 className="text-2xl font-display text-yellow-400 mb-4">Step 1: Initial Setup</h2>
            <div className="space-y-4">
                <Input value={character.name} onChange={(e) => setCharacter(p => ({ ...p, name: e.target.value }))} placeholder="Character Name" />
                <Input value={character.nationality} onChange={(e) => setCharacter(p => ({ ...p, nationality: e.target.value }))} placeholder="Nationality" />
                <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={character.isLocal} onChange={e => setCharacter(p => ({ ...p, isLocal: e.target.checked }))} className="form-checkbox h-5 w-5 text-yellow-600 bg-zinc-900 border-zinc-600 rounded-none focus:ring-yellow-500"/>
                    <span>Is your character a local in the game setting (e.g., Polish in Poland)?</span>
                </label>
                <div>
                    <h3 className="text-xl font-display text-yellow-500 mb-2">Attributes</h3>
                    <p className="text-zinc-400 mb-2">
                        You have <span className="font-bold text-yellow-400">{attributeIncreases.total}</span> increases remaining. 
                        (Rolled 2D3: {attributeIncreases.rolls[0]} + {attributeIncreases.rolls[1]})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(character.attributes).map(([attr, val]) => (
                            <div key={attr} className="bg-zinc-700/50 p-3 text-center">
                                <p className="font-bold uppercase font-display">{attr}</p>
                                <p className="text-3xl text-yellow-400 my-2">{val}</p>
                                <div className="flex justify-center space-x-2">
                                    <button onClick={() => handleAttrChange(attr, 'increase')} disabled={val === 'A' || attributeIncreases.total <= 0} className="w-8 h-8 bg-yellow-700 rounded-none disabled:bg-zinc-500">+</button>
                                    <button onClick={() => handleAttrChange(attr, 'decrease')} disabled={val === 'D'} className="w-8 h-8 bg-red-800 rounded-none disabled:bg-zinc-500">-</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={tradeForIncrease} disabled={Object.values(character.attributes).includes('D')} className="mt-4 w-full bg-zinc-600 hover:bg-zinc-700">Decrease one 'C' to 'D' for 1 extra increase</Button>
                </div>
                <Button onClick={nextStep} disabled={!character.name || !character.nationality || attributeIncreases.total > 0}>Continue to Childhood</Button>
            </div>
        </Card>
    );
};

const Step2_Childhood = ({ character, setCharacter, nextStep }) => {
    const [childhood, setChildhood] = useState('');
    const [skill, setSkill] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [language, setLanguage] = useState('');

    const handleNext = () => {
        const finalSpecialty = specialty === 'Linguist' ? `Linguist (${language})` : specialty;
        setCharacter(prev => ({
            ...prev,
            skills: { ...prev.skills, [skill]: 'D' },
            specialties: [...prev.specialties, finalSpecialty],
            careerPath: [...prev.careerPath, { career: {name: childhood, type: 'Childhood'}, skillsIncreased: [skill], specialtyGained: finalSpecialty }]
        }));
        nextStep();
    };
    
    const availableSpecialties = useMemo(() => {
        if (!childhood) return [];
        return gameData.CHILDHOODS[childhood].specialties.filter(s => {
            if (s === 'Linguist') return true;
            return !character.specialties.some(owned => owned.startsWith(s));
        });
    }, [childhood, character.specialties]);
    
    const skillOptions = useMemo(() => {
        if (!childhood) return [];
        return gameData.CHILDHOODS[childhood].skills.map(s => ({
            value: s,
            label: `${s} (${gameData.SKILLS_DATA[s].toUpperCase()})`
        }));
    }, [childhood]);
    
    useEffect(() => {
        if (specialty !== 'Linguist') setLanguage('');
    }, [specialty]);

    return (
        <Card>
            <h2 className="text-2xl font-display text-yellow-400 mb-4">Step 2: Childhood</h2>
            <div className="space-y-4">
                <Select value={childhood} onChange={e => { setChildhood(e.target.value); setSkill(''); setSpecialty(''); }} options={Object.keys(gameData.CHILDHOODS)} placeholder="Select Childhood" descriptions={Object.fromEntries(Object.entries(gameData.CHILDHOODS).map(([name, data]) => [name, `Skills: ${data.skills.join(', ')}`]))} />
                {childhood && <Select value={skill} onChange={e => setSkill(e.target.value)} options={skillOptions} placeholder="Select Skill (gets level D)" descriptions={gameData.SKILL_DESCRIPTIONS} />}
                {skill && <Select value={specialty} onChange={e => setSpecialty(e.target.value)} options={availableSpecialties} placeholder="Select Specialty" descriptions={gameData.SPECIALTY_DESCRIPTIONS} />}
                {specialty === 'Linguist' && <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Enter Language" />}
                <Button onClick={handleNext} disabled={!childhood || !skill || !specialty || (specialty === 'Linguist' && !language)}>Continue to First Career</Button>
            </div>
        </Card>
    );
};

const Step3_CareerTerm = ({ character, setCharacter, nextStep, setWarBrokeOut }) => {
    // --- STATE ---
    const [selectedCareerKey, setSelectedCareerKey] = useState('');
    const [skillIncreases, setSkillIncreases] = useState([]);
    const [promotionResult, setPromotionResult] = useState(null);
    const [promotionSpecialty, setPromotionSpecialty] = useState('');
    const [termInfo, setTermInfo] = useState(null);
    const [showAgingModal, setShowAgingModal] = useState(false);
    const [isPrisonTerm, setIsPrisonTerm] = useState(false);
    const [officerFunctionalArea, setOfficerFunctionalArea] = useState('');
    const [language, setLanguage] = useState('');
    const [showWarModal, setShowWarModal] = useState(false);
    const [warModalInfo, setWarModalInfo] = useState({ message: '', conscriptionMessage: '' });
    const [isDuplicateSpecialty, setIsDuplicateSpecialty] = useState(false);

    // --- COMPUTED VALUES (MEMOS) ---
    const availableCareers = useMemo(() => {
        const careers = Object.entries(gameData.CAREERS_DATA)
            .filter(([key]) => {
                if (isPrisonTerm) {
                    return key === 'prisoner';
                }
                return key !== 'prisoner' && gameData.CAREER_REQUIREMENTS[key](character.attributes, character.careerPath);
            })
            .map(([key, data]) => ({ label: `${data.group}: ${data.name}`, value: key }));
        return careers;
    }, [character.attributes, character.careerPath, isPrisonTerm]);

    const selectedCareerData = useMemo(() => selectedCareerKey ? gameData.CAREERS_DATA[selectedCareerKey] : null, [selectedCareerKey]);

    const isFirstMilitaryTerm = selectedCareerData?.type === 'military' && !character.careerPath.some(t => t.career.type === 'military');

    const officerFunctionalAreas = useMemo(() => {
        if (selectedCareerData?.name !== 'Officer') return [];
        return Object.entries(gameData.CAREERS_DATA)
            .filter(([key, data]) => data.type === 'military' && key !== 'officer' && gameData.CAREER_REQUIREMENTS[key](character.attributes, character.careerPath))
            .map(([key, data]) => ({ label: data.name, value: key }));
    }, [selectedCareerData, character.attributes, character.careerPath]);

    const availableSpecialties = useMemo(() => {
        if (!promotionResult?.success) return [];
        
        let baseList = [];
        if (isDuplicateSpecialty) {
            baseList = gameData.ALL_SPECIALTIES;
        } else if (selectedCareerData?.name === 'Officer' && officerFunctionalArea) {
            baseList = [...selectedCareerData.specialties, ...gameData.CAREERS_DATA[officerFunctionalArea].specialties];
        } else {
            baseList = selectedCareerData?.specialties || [];
        }

        return baseList.filter(s => {
            if (s === 'Linguist') return true;
            return !character.specialties.some(owned => owned.startsWith(s));
        });
    }, [promotionResult, isDuplicateSpecialty, selectedCareerData, officerFunctionalArea, character.specialties]);

    const skillPreview = useMemo(() => {
        if (termInfo && !showAgingModal) {
            return character.skills;
        }

        const preview = { ...character.skills };
        const getNextLevel = (currentLevel) => {
            if (!currentLevel || currentLevel === 'F') return 'D';
            if (currentLevel === 'D') return 'C';
            if (currentLevel === 'C') return 'B';
            if (currentLevel === 'B') return 'A';
            return 'A'; // Cannot go past A
        };

        if (skillIncreases.length === 1) {
            const skill = skillIncreases[0];
            preview[skill] = getNextLevel(character.skills[skill]);
        } else if (skillIncreases.length === 2) {
            const skill1 = skillIncreases[0];
            const skill2 = skillIncreases[1];

            if (skill1 === skill2) {
                const initialLevel = character.skills[skill1];
                const firstIncrease = getNextLevel(initialLevel);
                const secondIncrease = getNextLevel(firstIncrease);
                preview[skill1] = secondIncrease;
            } else {
                preview[skill1] = getNextLevel(character.skills[skill1]);
                preview[skill2] = getNextLevel(character.skills[skill2]);
            }
        }
        return preview;
    }, [character.skills, skillIncreases, termInfo, showAgingModal]);


    const availableSkillButtons = useMemo(() => {
        const buttons = new Set(selectedCareerData?.skills || []);
        if (selectedCareerData?.name === 'Officer' && officerFunctionalArea) {
            gameData.CAREERS_DATA[officerFunctionalArea].skills.forEach(s => buttons.add(s));
        }
        buttons.add('Stamina');
        buttons.add('Mobility');
        buttons.add('Driving');
        if (isFirstMilitaryTerm) {
            buttons.add('Ranged Combat');
        }
        const isNCO = character.rank && gameData.US_ARMY_RANKS.indexOf(character.rank) >= gameData.US_ARMY_RANKS.indexOf('Corporal');
        
        if (isNCO && selectedCareerData?.type === 'military' && selectedCareerData?.name !== 'Officer') {
            buttons.add('Command');
        }
        return Array.from(buttons);
    }, [selectedCareerData, isFirstMilitaryTerm, character.rank, officerFunctionalArea]);
    
    useEffect(() => {
        if (promotionSpecialty !== 'Linguist') setLanguage('');
    }, [promotionSpecialty]);

    // --- LOGIC FUNCTIONS ---
    const startNewTerm = (isPrison) => {
        setTimeout(() => {
            setSkillIncreases([]);
            setPromotionResult(null);
            setPromotionSpecialty('');
            setTermInfo(null);
            setIsPrisonTerm(isPrison);
            setIsDuplicateSpecialty(false);
            if (isPrison) {
                setSelectedCareerKey('prisoner');
            } else {
                setSelectedCareerKey('');
            }
        }, 3000);
    };

    const performWarCheck = (updatedCharacter) => {
        const warRoll = d8();
        const warBrokeOut = warRoll < updatedCharacter.termsCompleted;

        if (warBrokeOut) {
            const lastCareer = updatedCharacter.finalCareer;
            let conscriptionMessage = '';
            const isForcedIntoService = lastCareer?.type === 'civilian' && lastCareer?.group !== 'Intelligence' && !updatedCharacter.isLocal;
            
            if (isForcedIntoService) {
                conscriptionMessage = updatedCharacter.hasMilitaryService
                    ? "You've been recalled to active duty!"
                    : "You've been drafted into the military!";
            }

            setWarModalInfo({
                message: `After ${updatedCharacter.termsCompleted} term(s), the world has gone to hell. (War Check: Rolled ${warRoll}, needed < ${updatedCharacter.termsCompleted})`,
                conscriptionMessage: conscriptionMessage
            });
            setShowWarModal(true);
        } else {
             const wasCrimeTerm = selectedCareerData.group === 'Crime' && selectedCareerData.name !== 'Prisoner';
             const prisonRoll = d6();
             const goToPrison = wasCrimeTerm && (prisonRoll % 2 !== 0);
             if (goToPrison) {
                const prisonMessage = `Crime doesn't pay! Rolled a ${prisonRoll}. You're going to prison!`;
                setTermInfo({ prisonMessage });
                startNewTerm(true);
            } else {
                setTermInfo({ message: `Peace continues. (War Check: Rolled ${warRoll}, needed < ${updatedCharacter.termsCompleted})` });
                startNewTerm(false);
            }
        }
    };

    const finalizeTerm = (agingChoice = null) => {
        let newCuf = character.cuf;
        let newRank = character.rank;
        const finalSpecialty = promotionSpecialty === 'Linguist' ? `Linguist (${language})` : promotionSpecialty;

        if (promotionResult.success) {
            if (selectedCareerData.type === 'military' || selectedCareerData.group === 'Intelligence') {
                 if (newCuf !== 'A') newCuf = String.fromCharCode(newCuf.charCodeAt(0) - 1);
            }
            if (selectedCareerData.type === 'military' && newRank) {
                const currentRankIndex = gameData.US_ARMY_RANKS.indexOf(newRank);
                if (currentRankIndex < gameData.US_ARMY_RANKS.length - 1) {
                    newRank = gameData.US_ARMY_RANKS[currentRankIndex + 1];
                }
            }
        }
       
        const newSkills = { ...character.skills };
        skillIncreases.forEach(skill => {
            const currentLevel = newSkills[skill] || 'F';
            if (currentLevel === 'F') newSkills[skill] = 'D';
            else if (currentLevel > 'A') newSkills[skill] = String.fromCharCode(currentLevel.charCodeAt(0) - 1);
        });

        const ageIncrease = d6();
        const newAge = character.age + ageIncrease;
        let newAttributes = { ...character.attributes };
        
        if (agingChoice) {
            newAttributes[agingChoice] = String.fromCharCode(newAttributes[agingChoice].charCodeAt(0) + 1);
        }
        
        const updatedCharacter = {
            ...character, age: newAge, cuf: newCuf, rank: newRank, skills: newSkills, attributes: newAttributes,
            specialties: promotionSpecialty ? [...character.specialties, finalSpecialty] : character.specialties,
            careerPath: [...character.careerPath, { career: selectedCareerData, skillsIncreased: skillIncreases, promotion: promotionResult.success, specialtyGained: finalSpecialty, ageIncrease, functionalArea: officerFunctionalArea ? gameData.CAREERS_DATA[officerFunctionalArea].name : null }],
            termsCompleted: character.termsCompleted + 1, finalCareer: selectedCareerData
        };

        setCharacter(updatedCharacter);
        setShowAgingModal(false);
        setTermInfo(null);
        performWarCheck(updatedCharacter);
    };

    const finishTerm = () => {
        setTermInfo({ processing: true }); // Prevent skill preview glitch
        const agingRoll = d8();
        const agingFailed = agingRoll < character.termsCompleted;
        let agingMessage = `Aging Check (D8): Rolled ${agingRoll}. Need < ${character.termsCompleted}. No effect.`;
        if (agingFailed) {
            agingMessage = `Aging Check (D8): Rolled ${agingRoll}. You must reduce one attribute!`;
            setShowAgingModal(true);
        }
        setTermInfo({agingMessage});

        if (!agingFailed) {
            finalizeTerm();
        }
    };
    
    const handleCareerSelection = (e) => {
        const newCareerKey = e.target.value;
        setSelectedCareerKey(newCareerKey);
        setSkillIncreases([]);
        setPromotionResult(null);
        setPromotionSpecialty('');
        setOfficerFunctionalArea('');

        const careerData = gameData.CAREERS_DATA[newCareerKey];
        if (careerData && careerData.type === 'military') {
            setCharacter(p => ({ ...p, hasMilitaryService: true }));
        }

        if (careerData && careerData.startRank) {
            const newStartRank = careerData.startRank;
            const newStartRankIndex = gameData.US_ARMY_RANKS.indexOf(newStartRank);
            
            const currentRank = character.rank;
            const currentRankIndex = currentRank ? gameData.US_ARMY_RANKS.indexOf(currentRank) : -1;

            if (currentRankIndex === -1 || newStartRankIndex > currentRankIndex) {
                setCharacter(p => ({...p, rank: newStartRank}));
            }
        }
    };
    
    const handleSkillIncrease = (skill) => {
        if (skillIncreases.length < 2) {
            setSkillIncreases(prev => [...prev, skill]);
        }
    };

    const handleSkillRemove = (indexToRemove) => {
        setSkillIncreases(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handlePromotion = () => {
        let skillToRoll;
        let newLevelForRoll;
        const getNextLevel = (currentLevel) => currentLevel === 'F' ? 'D' : String.fromCharCode(currentLevel.charCodeAt(0) - 1);
        if (skillIncreases[0] === skillIncreases[1]) {
            skillToRoll = skillIncreases[0];
            const currentLevel = character.skills[skillToRoll] || 'F';
            newLevelForRoll = getNextLevel(getNextLevel(currentLevel));
        } else {
            const [skillA, skillB] = skillIncreases;
            const [newLevelA, newLevelB] = [getNextLevel(character.skills[skillA] || 'F'), getNextLevel(character.skills[skillB] || 'F')];
            const [attrA, attrB] = [gameData.SKILLS_DATA[skillA], gameData.SKILLS_DATA[skillB]];
            const powerA = gameData.DIE_SIZES[getDie(character.attributes[attrA])] + gameData.DIE_SIZES[getDie(newLevelA)];
            const powerB = gameData.DIE_SIZES[getDie(character.attributes[attrB])] + gameData.DIE_SIZES[getDie(newLevelB)];
            skillToRoll = powerA >= powerB ? skillA : skillB;
            newLevelForRoll = powerA >= powerB ? newLevelA : newLevelB;
        }
        const attrForSkill = gameData.SKILLS_DATA[skillToRoll];
        const result = rollCheck(getDie(character.attributes[attrForSkill]), getDie(newLevelForRoll));
        result.skillRolled = skillToRoll;
        setPromotionResult(result);

        if (result.success) {
            let specialtyList;
            if (selectedCareerData.name === 'Officer' && officerFunctionalArea) {
                const listRoll = d6();
                if (listRoll <= 3) {
                    specialtyList = selectedCareerData.specialties;
                } else {
                    specialtyList = gameData.CAREERS_DATA[officerFunctionalArea].specialties;
                }
            } else {
                specialtyList = selectedCareerData.specialties;
            }

            const specialtyRoll = d6();
            const rolledSpecialty = specialtyList[specialtyRoll - 1];
            
            if (character.specialties.some(s => s.startsWith(rolledSpecialty))) {
                setIsDuplicateSpecialty(true);
            } else {
                setPromotionSpecialty(rolledSpecialty);
            }
        }
    };

    const handleWarAcknowledged = () => {
        setShowWarModal(false);
        setWarBrokeOut(true);
        nextStep();
    }

    return (
        <>
             {/* --- WAR MODAL --- */}
            {showWarModal && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <Card className="max-w-md w-full text-center">
                        <h3 className="text-3xl font-display text-red-500 mb-4">WAR HAS BROKEN OUT</h3>
                        <p className="mb-4 text-zinc-300">{warModalInfo.message}</p>
                        {warModalInfo.conscriptionMessage && (
                            <p className="font-bold text-yellow-400 text-xl mb-6">{warModalInfo.conscriptionMessage}</p>
                        )}
                        <Button onClick={handleWarAcknowledged} className="w-full">Acknowledged</Button>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-2xl font-display text-yellow-400 mb-4">Term {character.termsCompleted + 1} (Age: {character.age})</h2>
                    
                    {showAgingModal ? (
                        <div>
                            <h3 className="text-2xl font-display text-yellow-400 mb-4">The Years Take Their Toll...</h3>
                            <p className="mb-4">{termInfo.agingMessage}</p>
                            <h4 className="font-bold mt-4">Choose an attribute to reduce by one step:</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {Object.keys(character.attributes)
                                    .filter(a => character.attributes[a] !== 'D')
                                    .map(attr => <Button key={attr} onClick={() => finalizeTerm(attr)}>{attr.toUpperCase()}</Button>
                                )}
                            </div>
                        </div>
                    ) : termInfo ? (
                        <>
                            {(termInfo.prisonMessage || termInfo.message) && <p className="text-yellow-400 font-bold mb-4">{termInfo.prisonMessage || termInfo.message}</p>}
                            <p className="text-zinc-500">Processing term...</p>
                        </>
                    ) : (
                    <div className="space-y-4">
                        <Select value={selectedCareerKey} onChange={handleCareerSelection} options={availableCareers} placeholder="Select a Career for this Term" disabled={isPrisonTerm} descriptions={Object.fromEntries(Object.entries(gameData.CAREERS_DATA).map(([key, data]) => [key, `Skills: ${data.skills.join(', ')}`]))} />

                        {selectedCareerData?.name === 'Officer' && (
                            <Select value={officerFunctionalArea} onChange={e => setOfficerFunctionalArea(e.target.value)} options={officerFunctionalAreas} placeholder="Select Functional Area" descriptions={Object.fromEntries(Object.entries(gameData.CAREERS_DATA).filter(([,data]) => data.type === 'military').map(([key, data]) => [key, `Skills: ${data.skills.join(', ')}`]))} />
                        )}

                        {selectedCareerData && (selectedCareerData.name !== 'Officer' || officerFunctionalArea) && (
                            <div>
                                <h3 className="text-lg font-display text-yellow-500 mt-4">Skill Increases</h3>
                                <p className="text-zinc-400">Increase two skills one step each, or one skill two steps.</p>
                                {isFirstMilitaryTerm && <p className="text-yellow-400 font-bold">First military term: One increase MUST be Ranged Combat.</p>}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {availableSkillButtons.map(s => (
                                        <Button key={s} onClick={() => handleSkillIncrease(s)} disabled={skillPreview[s] === 'A' || skillIncreases.length >= 2 || (isFirstMilitaryTerm && s !== 'Ranged Combat' && !skillIncreases.includes('Ranged Combat'))} title={gameData.SKILL_DESCRIPTIONS[s]}>{s} ({gameData.SKILLS_DATA[s].toUpperCase()})</Button>
                                    ))}
                                </div>
                                {skillIncreases.length > 0 && (
                                    <div className="mt-2 p-2 border border-zinc-700">
                                        <h4 className="font-bold text-yellow-500">Selected:</h4>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {skillIncreases.map((skill, index) => {
                                                const isRemovable = !(isFirstMilitaryTerm && skill === 'Ranged Combat' && index === 0);
                                                return (
                                                    <div key={index} className="flex items-center bg-zinc-700 px-2 py-1">
                                                        <span>{skill}</span>
                                                        {isRemovable && (
                                                            <button onClick={() => handleSkillRemove(index)} className="ml-2 text-red-500 hover:text-red-400 font-bold">
                                                                [x]
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {skillIncreases.length === 2 && (
                            <Button onClick={handlePromotion} disabled={promotionResult !== null}>Roll for Promotion</Button>
                        )}

                        {promotionResult && (
                            <div>
                                <p className="font-bold text-xl mt-4">
                                    Promotion Roll (vs {promotionResult.skillRolled}): <span className={promotionResult.success ? 'text-yellow-400' : 'text-red-500'}>{promotionResult.success ? 'Success!' : 'Failure.'}</span>
                                    <span className="text-sm text-zinc-400 ml-2">
                                        (Rolled {promotionResult.attrDie}: {promotionResult.attrRoll}
                                        {promotionResult.skillDie !== 'None' && `, ${promotionResult.skillDie}: ${promotionResult.skillRoll}`})
                                    </span>
                                </p>
                                {promotionResult.success && (
                                    <div className="mt-2">
                                        {isDuplicateSpecialty ? (
                                            <>
                                                <p>You rolled a specialty you already know! You may choose any specialty.</p>
                                                <Select value={promotionSpecialty} onChange={e => setPromotionSpecialty(e.target.value)} options={availableSpecialties} placeholder="Select Your New Specialty" descriptions={gameData.SPECIALTY_DESCRIPTIONS} />
                                            </>
                                        ) : (
                                            <p>You gained the <span className="font-bold text-yellow-400" title={gameData.SPECIALTY_DESCRIPTIONS[promotionSpecialty]}>{promotionSpecialty}</span> specialty.</p>
                                        )}
                                        {promotionSpecialty === 'Linguist' && <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Enter Language" />}
                                    </div>
                                )}
                                <Button onClick={finishTerm} className="mt-4" disabled={promotionResult.success && (!promotionSpecialty || (promotionSpecialty === 'Linguist' && !language))}>Finish Term</Button>
                            </div>
                        )}
                    </div>
                    )}
                </Card>
                <CharacterStatus character={character} skillPreview={skillPreview} />
            </div>
        </>
    );
};

const Step4_AtWar = ({ character, setCharacter, nextStep }) => {
    const [skillIncreases, setSkillIncreases] = useState([]);
    const [specialty, setSpecialty] = useState('');
    const [language, setLanguage] = useState('');
    
    const isDraftee = useMemo(() => {
        return character.finalCareer?.type === 'civilian' && character.finalCareer?.group !== 'Intelligence' && !character.isLocal;
    }, [character]);
    
    const needsRangedCombat = isDraftee && !character.skills['Ranged Combat'];
    
    useEffect(() => {
        if (needsRangedCombat) {
            setSkillIncreases(['Ranged Combat']);
        }
    }, [needsRangedCombat]);

    const atWarSpecialtyOptions = useMemo(() => {
        if (isDraftee) {
            return gameData.AT_WAR_SPECIALTIES.Military.filter(s => !character.specialties.some(owned => owned.startsWith(s)));
        }
        const lastCareer = character.finalCareer;
        if (!lastCareer) return [];
        let options;
        if (lastCareer.type === 'military') options = gameData.AT_WAR_SPECIALTIES.Military;
        else {
            switch(lastCareer.group) {
                case 'Blue Collar': options = gameData.AT_WAR_SPECIALTIES['Blue Collar']; break;
                case 'White Collar':
                case 'Education': options = gameData.AT_WAR_SPECIALTIES['White Collar']; break;
                default: options = gameData.AT_WAR_SPECIALTIES.Other;
            }
        }
        return options.filter(s => {
            if (s === 'Linguist') return true;
            return !character.specialties.some(owned => owned.startsWith(s));
        });
    }, [character.finalCareer, character.specialties, isDraftee]);

    const handleSkillIncrease = (skill) => {
        if (skillIncreases.length < 2 && !skillIncreases.includes(skill)) {
            setSkillIncreases(prev => [...prev, skill]);
        }
    };

    const handleSkillRemove = (indexToRemove) => {
        setSkillIncreases(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleNext = () => {
        const newSkills = { ...character.skills };
        skillIncreases.forEach(skill => {
            const currentLevel = newSkills[skill] || 'F';
            if (currentLevel === 'F') newSkills[skill] = 'D';
            else if (currentLevel > 'A') newSkills[skill] = String.fromCharCode(currentLevel.charCodeAt(0) - 1);
        });
        
        const finalSpecialty = specialty === 'Linguist' ? `Linguist (${language})` : specialty;

        setCharacter(prev => ({
            ...prev,
            skills: newSkills,
            specialties: [...prev.specialties, finalSpecialty],
            careerPath: [...prev.careerPath, { career: {name: 'At War', type: 'military'}, skillsIncreased: skillIncreases, specialtyGained: finalSpecialty }],
        }));
        nextStep();
    };

    const skillPreview = useMemo(() => {
        const preview = { ...character.skills };
        skillIncreases.forEach(skill => {
            const currentLevel = preview[skill] || 'F';
            if (currentLevel === 'F') preview[skill] = 'D';
            else if (currentLevel > 'A') preview[skill] = String.fromCharCode(currentLevel.charCodeAt(0) - 1);
        });
        return preview;
    }, [character.skills, skillIncreases]);
    
    useEffect(() => {
        if (specialty !== 'Linguist') setLanguage('');
    }, [specialty]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h2 className="text-2xl font-display text-yellow-400 mb-4">Step 4: At War</h2>
                {isDraftee && <p className="text-yellow-400 font-bold mb-4">{character.hasMilitaryService ? "You've been recalled to active duty!" : "You've been drafted into the military!"}</p>}
                <p className="text-zinc-300 mb-4">The world has gone to hell. You get one final term. Increase any two skills by one step each, and gain one final specialty.</p>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-display text-yellow-500">Skill Increases</h3>
                        {needsRangedCombat && <p className="text-yellow-400 font-bold">As a draftee, one increase MUST be Ranged Combat.</p>}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.keys(gameData.SKILLS_DATA).map(s => (
                                <Button key={s} onClick={() => handleSkillIncrease(s)} disabled={skillPreview[s] === 'A' || skillIncreases.length >= 2 || skillIncreases.includes(s) || (needsRangedCombat && s === 'Ranged Combat')} title={gameData.SKILL_DESCRIPTIONS[s]}>{s} ({gameData.SKILLS_DATA[s].toUpperCase()})</Button>
                            ))}
                        </div>
                         {skillIncreases.length > 0 && (
                            <div className="mt-2 p-2 border border-zinc-700">
                                <h4 className="font-bold text-yellow-500">Selected:</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {skillIncreases.map((skill, index) => {
                                        const isRemovable = !(needsRangedCombat && skill === 'Ranged Combat');
                                        return (
                                            <div key={index} className="flex items-center bg-zinc-700 px-2 py-1">
                                                <span>{skill}</span>
                                                {isRemovable && (
                                                    <button onClick={() => handleSkillRemove(index)} className="ml-2 text-red-500 hover:text-red-400 font-bold">
                                                        [x]
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                    {skillIncreases.length === 2 && (
                        <>
                        <Select value={specialty} onChange={e => setSpecialty(e.target.value)} options={atWarSpecialtyOptions} placeholder="Select Final Specialty" descriptions={gameData.SPECIALTY_DESCRIPTIONS} />
                        {specialty === 'Linguist' && <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Enter Language" />}
                        </>
                    )}
                    <Button onClick={handleNext} disabled={skillIncreases.length < 2 || !specialty || (specialty === 'Linguist' && !language)}>Continue to Character Sheet</Button>
                </div>
            </Card>
            <CharacterStatus character={character} skillPreview={skillPreview} />
        </div>
    );
};

const Step5_Finalize = ({ character, setCharacter, nextStep }) => {
    useEffect(() => {
        const isDraftee = character.finalCareer?.type === 'civilian' && character.finalCareer?.group !== 'Intelligence' && !character.isLocal;
        
        const strSize = gameData.DIE_SIZES[getDie(character.attributes.str)];
        const aglSize = gameData.DIE_SIZES[getDie(character.attributes.agl)];
        const intSize = gameData.DIE_SIZES[getDie(character.attributes.int)];
        const empSize = gameData.DIE_SIZES[getDie(character.attributes.emp)];
        
        const hitCapacity = Math.ceil((strSize + aglSize) / 4);
        const stressCapacity = Math.ceil((intSize + empSize) / 4);
        const rads = d6();
        const finalGear = isDraftee ? gameData.CAREERS_DATA["combat_arms"].gear : character.finalCareer?.gear || [];
        
        let finalRank = character.rank;
        if (isDraftee && !finalRank) {
            if(character.skills.Tech || character.skills['Medical Aid']) {
                finalRank = "Private First Class";
            } else {
                finalRank = "Private";
            }
        }

        setCharacter(prev => ({
            ...prev,
            hitCapacity, stressCapacity, rads, gear: finalGear, rank: finalRank
        }));
        nextStep();
    }, []);

    return null; // This component doesn't render anything visible
};

const CharacterSheet = ({ character, startOver }) => {
    const handleSave = () => {
        const textContent = generateCharacterSheetText(character);
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `T2K4E - ${character.name.replace(/\s/g, '_') || 'character'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="max-w-4xl mx-auto font-mono">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-display text-yellow-400">{character.name}</h1>
                <p className="text-lg text-zinc-300">{character.nationality} | Age: {character.age}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                    <h3 className="text-xl font-display border-b border-zinc-600 mb-2 text-yellow-400">ATTRIBUTES & SKILLS</h3>
                     <div className="grid grid-cols-2 gap-x-4">
                        {['str', 'agl', 'int', 'emp'].map(attrKey => {
                            const skillsForAttr = Object.entries(gameData.SKILLS_DATA).filter(([_, attr]) => attr === attrKey);
                            return (
                                <div key={attrKey}>
                                    <h4 className="font-semibold mt-2 uppercase text-yellow-500">{attrKey}: {character.attributes[attrKey]} ({gameData.ATTRIBUTE_DICE[character.attributes[attrKey]]})</h4>
                                    {skillsForAttr.map(([skillName, _]) => {
                                        const skillLevel = character.skills[skillName] || '-';
                                        const skillDie = skillLevel !== '-' ? `(${gameData.ATTRIBUTE_DICE[skillLevel]})` : '';
                                        return (
                                            <p key={skillName} title={gameData.SKILL_DESCRIPTIONS[skillName]}>
                                                <span className="font-bold">{skillName}:</span> {skillLevel} {skillDie}
                                            </p>
                                        )
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-display border-b border-zinc-600 mb-2 text-yellow-400">COMBAT STATS</h3>
                    <p><span className="font-bold">Hit Capacity:</span> {character.hitCapacity}</p>
                    <p><span className="font-bold">Stress Capacity:</span> {character.stressCapacity}</p>
                    <p><span className="font-bold">Coolness Under Fire (CUF):</span> {character.cuf}</p>
                    {character.rank && <p><span className="font-bold">Rank:</span> {character.rank}</p>}
                    <p><span className="font-bold">Permanent Rads:</span> {character.rads}</p>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-display border-b border-zinc-600 mb-2 text-yellow-400">SPECIALTIES</h3>
                <p>
                    {character.specialties.map((spec, index) => (
                        <span key={index} title={gameData.SPECIALTY_DESCRIPTIONS[spec.split(' (')[0]]}>
                            {spec}{index < character.specialties.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
            </div>
            
            <div className="mb-6">
                <h3 className="text-xl font-display border-b border-zinc-600 mb-2 text-yellow-400">GEAR</h3>
                <ul className="list-disc list-inside">
                    {character.gear.map((item, i) => <li key={i}>{item}</li>)}
                    <li>D6 rations of food and water, D6 rounds of ammo</li>
                </ul>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-display border-b border-zinc-600 mb-2 text-yellow-400">CAREER PATH</h3>
                <ul className="list-disc list-inside">
                    {character.careerPath.map((term, i) => {
                        let label = `Term ${i}`;
                        if (term.career.type === 'Childhood') {
                            label = 'Childhood';
                        } else if (term.career.name === 'At War') {
                            label = 'At War';
                        }
                        
                        let careerName = term.career.name;
                        if (term.career.name === 'Officer' && term.functionalArea) {
                            careerName = `Officer [${term.functionalArea}]`;
                        } else if (term.career.name === 'At War') {
                             careerName = '';
                        }

                        return (
                            <li key={i}>
                                <strong>{label}:</strong> {careerName ? `${careerName} ` : ''}({term.skillsIncreased.join(', ')}) {term.specialtyGained && `-> ${term.specialtyGained}`}
                            </li>
                        )
                    })}
                </ul>
            </div>
            
            <div className="flex space-x-4 mt-6">
                <Button onClick={handleSave} className="w-full bg-green-700 hover:bg-green-800">Save to File</Button>
                <Button onClick={startOver} className="w-full">Create Another Character</Button>
            </div>
        </Card>
    );
};


export default function App() {
    const [step, setStep] = useState(1);
    const [character, setCharacter] = useState(initialCharacter);
    const [attributeIncreases, setAttributeIncreases] = useState({ rolls: [], total: 0 });
    const [warBrokeOut, setWarBrokeOut] = useState(false);

    useEffect(() => {
        setAttributeIncreases(twoD3());
    }, []);

    const startOver = () => {
        setCharacter(initialCharacter);
        setStep(1);
        setWarBrokeOut(false);
        setAttributeIncreases(twoD3());
    };

    const nextStep = () => setStep(s => s + 1);

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1_InitialSetup character={character} setCharacter={setCharacter} attributeIncreases={attributeIncreases} setAttributeIncreases={setAttributeIncreases} nextStep={nextStep} />;
            case 2:
                return <Step2_Childhood character={character} setCharacter={setCharacter} nextStep={nextStep} />;
            case 3:
                return <Step3_CareerTerm character={character} setCharacter={setCharacter} nextStep={nextStep} setWarBrokeOut={setWarBrokeOut} />;
            case 4:
                return <Step4_AtWar character={character} setCharacter={setCharacter} nextStep={nextStep} />;
            case 5:
                return <Step5_Finalize character={character} setCharacter={setCharacter} nextStep={nextStep} />;
            case 6:
                return <CharacterSheet character={character} startOver={startOver} />;
            default:
                return <Button onClick={startOver}>Start Over</Button>;
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&family=Roboto+Mono&display=swap');
                
                .font-display { font-family: 'Chakra Petch', sans-serif; }
                .font-body { font-family: 'Roboto Mono', monospace; }

                body {
                    background-color: #000000;
                }
            `}</style>
            <div className="text-zinc-300 min-h-screen p-4 sm:p-8 font-body">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-8">
                        <h1 className="text-5xl font-display text-yellow-400 tracking-widest">TWILIGHT:2000</h1>
                        <p className="text-lg text-zinc-400">Lifepath Character Creator</p>
                    </header>
                    <main>
                        {renderStep()}
                    </main>
                </div>
            </div>
        </>
    );
}
