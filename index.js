/* global Promise */
import { Drug, Pharmacy } from "./pharmacy";
import fs from "fs";

/** Number of days to simulate the pharmacy */
const SIMULATION_DAYS = 30;
/** Output file path for simulation results */
const OUTPUT_FILE = "output.json";

/**
 * Creates the initial set of drugs for the simulation.
 * @returns {Drug[]} Array of drugs with their initial states
 */
const createInitialDrugs = () => [
  new Drug("Doliprane", 20, 30),
  new Drug("Herbal Tea", 10, 5),
  new Drug("Fervex", 12, 35),
  new Drug("Magic Pill", 15, 40),
];

/**
 * Simulates the pharmacy system over a specified number of days.
 * @param {number} days - Number of days to simulate
 * @returns {Array} Array of daily drug states
 */
const simulatePharmacy = (days) => {
  const pharmacy = new Pharmacy(createInitialDrugs());
  const log = [];

  for (let elapsedDays = 0; elapsedDays < days; elapsedDays++) {
    log.push(JSON.parse(JSON.stringify(pharmacy.updateBenefitValue())));
  }

  return log;
};

/**
 * Saves simulation results to a JSON file.
 * @param {Array} results - Simulation results to save
 * @returns {Promise} Promise that resolves when the file is written
 */
const saveSimulationResults = (results) => {
  const data = JSON.stringify({ result: results }, null, 2).concat("\n");

  return new Promise((resolve, reject) => {
    fs.writeFile(OUTPUT_FILE, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Main simulation runner that orchestrates the entire process.
 * Handles the simulation and saving of results.
 */
const runSimulation = async () => {
  try {
    const results = simulatePharmacy(SIMULATION_DAYS);
    await saveSimulationResults(results);
    console.log("success");
  } catch (error) {
    console.log("error");
  }
};

runSimulation();
