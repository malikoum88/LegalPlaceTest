import fs from "fs";
import { Drug } from "./pharmacy";
import {
  createInitialDrugs,
  simulatePharmacy,
  saveSimulationResults,
  SIMULATION_DAYS,
  OUTPUT_FILE,
} from "./index";

// Mock fs module
jest.mock("fs");

describe("createInitialDrugs", () => {
  it("should create drugs with correct initial values", () => {
    const drugs = createInitialDrugs();
    expect(drugs).toHaveLength(4);
    expect(drugs[0]).toEqual(new Drug("Doliprane", 20, 30));
    expect(drugs[1]).toEqual(new Drug("Herbal Tea", 10, 5));
    expect(drugs[2]).toEqual(new Drug("Fervex", 12, 35));
    expect(drugs[3]).toEqual(new Drug("Magic Pill", 15, 40));
  });
});

describe("simulatePharmacy", () => {
  it("should simulate correct number of days", () => {
    const results = simulatePharmacy(2);
    expect(results).toHaveLength(2);
  });

  it("should update drugs correctly each day", () => {
    const results = simulatePharmacy(1);
    const firstDay = results[0];
    expect(firstDay[0].benefit).toBe(29); // Doliprane
    expect(firstDay[1].benefit).toBe(6); // Herbal Tea
    expect(firstDay[2].benefit).toBe(36); // Fervex
    expect(firstDay[3].benefit).toBe(40); // Magic Pill
  });

  it("should maintain correct sequence of updates", () => {
    const results = simulatePharmacy(2);
    const secondDay = results[1];
    expect(secondDay[0].benefit).toBe(28); // Doliprane
    expect(secondDay[1].benefit).toBe(7); // Herbal Tea
    expect(secondDay[2].benefit).toBe(37); // Fervex
    expect(secondDay[3].benefit).toBe(40); // Magic Pill
  });
});

describe("saveSimulationResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should write results to file successfully", async () => {
    const mockResults = [{ test: "data" }];
    fs.writeFile.mockImplementation((file, data, callback) => {
      callback(null);
    });

    await saveSimulationResults(mockResults);

    expect(fs.writeFile).toHaveBeenCalledWith(
      OUTPUT_FILE,
      JSON.stringify({ result: mockResults }, null, 2).concat("\n"),
      expect.any(Function),
    );
  });

  it("should handle write errors", async () => {
    const mockResults = [{ test: "data" }];
    const mockError = new Error("Write failed");
    fs.writeFile.mockImplementation((file, data, callback) => {
      callback(mockError);
    });

    await expect(saveSimulationResults(mockResults)).rejects.toThrow(mockError);
  });
});

describe("Integration tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should complete full simulation and save process", async () => {
    fs.writeFile.mockImplementation((file, data, callback) => {
      callback(null);
    });

    const results = simulatePharmacy(SIMULATION_DAYS);
    await saveSimulationResults(results);

    expect(results).toHaveLength(SIMULATION_DAYS);
    expect(fs.writeFile).toHaveBeenCalledWith(
      OUTPUT_FILE,
      expect.any(String),
      expect.any(Function),
    );
  });

  it("should maintain data integrity throughout simulation", async () => {
    const results = simulatePharmacy(SIMULATION_DAYS);
    const lastDay = results[results.length - 1];
    expect(lastDay).toHaveLength(4);
    lastDay.forEach((drug) => {
      expect(drug).toHaveProperty("name");
      expect(drug).toHaveProperty("expiresIn");
      expect(drug).toHaveProperty("benefit");
      expect(drug.benefit).toBeGreaterThanOrEqual(0);
      expect(drug.benefit).toBeLessThanOrEqual(50);
    });
  });
}); 