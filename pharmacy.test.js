import { Drug, HerbalTea, Fervex, MagicPill, Pharmacy } from "./pharmacy";

describe("Drug", () => {
  it("should decrease benefit and expiresIn for regular drugs", () => {
    const drug = new Drug("test", 2, 3);
    drug.updateBenefit();
    expect(drug.benefit).toBe(2);
    expect(drug.expiresIn).toBe(1);
  });

  it("should not decrease benefit below 0", () => {
    const drug = new Drug("test", 2, 0);
    drug.updateBenefit();
    expect(drug.benefit).toBe(0);
  });

  it("should decrease benefit twice as fast after expiration", () => {
    const drug = new Drug("test", 0, 3);
    drug.updateBenefit();
    expect(drug.benefit).toBe(1);
    expect(drug.expiresIn).toBe(-1);
  });
});

describe("HerbalTea", () => {
  it("should increase benefit over time", () => {
    const tea = new HerbalTea("Herbal Tea", 2, 3);
    tea.updateBenefit();
    expect(tea.benefit).toBe(4);
    expect(tea.expiresIn).toBe(1);
  });

  it("should not increase benefit above 50", () => {
    const tea = new HerbalTea("Herbal Tea", 2, 50);
    tea.updateBenefit();
    expect(tea.benefit).toBe(50);
  });

  it("should continue to increase benefit after expiration", () => {
    const tea = new HerbalTea("Herbal Tea", 0, 3);
    tea.updateBenefit();
    expect(tea.benefit).toBe(5);
    expect(tea.expiresIn).toBe(-1);
  });
});

describe("Fervex", () => {
  it("should increase benefit as it gets closer to expiration", () => {
    const fervex = new Fervex("Fervex", 12, 3);
    fervex.updateBenefit();
    expect(fervex.benefit).toBe(4);
    expect(fervex.expiresIn).toBe(11);
  });

  it("should increase benefit by 2 when less than 11 days to expiration", () => {
    const fervex = new Fervex("Fervex", 10, 3);
    fervex.updateBenefit();
    expect(fervex.benefit).toBe(5);
  });

  it("should increase benefit by 3 when less than 6 days to expiration", () => {
    const fervex = new Fervex("Fervex", 5, 3);
    fervex.updateBenefit();
    expect(fervex.benefit).toBe(6);
  });

  it("should drop benefit to 0 after expiration", () => {
    const fervex = new Fervex("Fervex", 0, 50);
    fervex.updateBenefit();
    expect(fervex.benefit).toBe(0);
    expect(fervex.expiresIn).toBe(-1);
  });
});

describe("MagicPill", () => {
  it("should never change", () => {
    const pill = new MagicPill("Magic Pill", 2, 3);
    pill.updateBenefit();
    expect(pill.benefit).toBe(3);
    expect(pill.expiresIn).toBe(2);
  });
});

describe("Pharmacy", () => {
  it("should update all drugs in the pharmacy", () => {
    const drugs = [
      new Drug("Doliprane", 2, 3),
      new HerbalTea("Herbal Tea", 2, 3),
      new Fervex("Fervex", 12, 3),
      new MagicPill("Magic Pill", 2, 3),
    ];
    const pharmacy = new Pharmacy(drugs);
    const updatedDrugs = pharmacy.updateBenefitValue();

    expect(updatedDrugs[0].benefit).toBe(2); // Regular drug
    expect(updatedDrugs[1].benefit).toBe(4); // Herbal Tea
    expect(updatedDrugs[2].benefit).toBe(4); // Fervex
    expect(updatedDrugs[3].benefit).toBe(3); // Magic Pill
  });

  it("should handle empty pharmacy", () => {
    const pharmacy = new Pharmacy();
    expect(pharmacy.updateBenefitValue()).toEqual([]);
  });

  it("should create correct drug types based on name", () => {
    const drugs = [
      { name: "Herbal Tea", expiresIn: 2, benefit: 3 },
      { name: "Fervex", expiresIn: 12, benefit: 3 },
      { name: "Magic Pill", expiresIn: 2, benefit: 3 },
      { name: "Unknown", expiresIn: 2, benefit: 3 },
    ];
    const pharmacy = new Pharmacy(drugs);
    const updatedDrugs = pharmacy.updateBenefitValue();

    expect(updatedDrugs[0].benefit).toBe(4); // Herbal Tea
    expect(updatedDrugs[1].benefit).toBe(4); // Fervex
    expect(updatedDrugs[2].benefit).toBe(3); // Magic Pill
    expect(updatedDrugs[3].benefit).toBe(2); // Regular drug
  });
});
