/**
 * Base class for all drugs in the pharmacy system.
 * Handles basic drug properties and update logic.
 */
export class Drug {
  /**
   * Creates a new drug instance.
   * @param {string} name - The name of the drug
   * @param {number} expiresIn - Number of days until the drug expires
   * @param {number} benefit - The benefit value of the drug (0-50)
   */
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  /**
   * Updates the drug's benefit and expiration status.
   * This is the main update method that orchestrates the update process.
   */
  updateBenefit() {
    this.updateBenefitBeforeExpiration();
    this.decreaseExpiresIn();
    this.updateBenefitAfterExpiration();
  }

  /**
   * Updates the drug's benefit before expiration.
   * By default, decreases benefit by 1 if greater than 0.
   */
  updateBenefitBeforeExpiration() {
    if (this.benefit > 0) {
      this.benefit -= 1;
    }
  }

  /**
   * Decreases the drug's expiration time by 1 day.
   */
  decreaseExpiresIn() {
    this.expiresIn -= 1;
  }

  /**
   * Updates the drug's benefit after expiration.
   * By default, decreases benefit by 1 if expired and benefit is greater than 0.
   */
  updateBenefitAfterExpiration() {
    if (this.expiresIn < 0) {
      if (this.benefit > 0) {
        this.benefit -= 1;
      }
    }
  }
}

/**
 * Special drug that increases in benefit over time.
 * Benefit increases both before and after expiration.
 */
export class HerbalTea extends Drug {
  /**
   * Increases benefit by 1 if less than 50.
   */
  updateBenefitBeforeExpiration() {
    if (this.benefit < 50) {
      this.benefit += 1;
    }
  }

  /**
   * Increases benefit by 1 if expired and less than 50.
   */
  updateBenefitAfterExpiration() {
    if (this.expiresIn < 0) {
      if (this.benefit < 50) {
        this.benefit += 1;
      }
    }
  }
}

/**
 * Special drug that increases in benefit as it gets closer to expiration.
 * Benefit increases more rapidly when close to expiration.
 * Benefit drops to 0 after expiration.
 */
export class Fervex extends Drug {
  /**
   * Increases benefit based on proximity to expiration:
   * - Increases by 1 if less than 50
   * - Increases by 1 more if less than 11 days to expiration
   * - Increases by 1 more if less than 6 days to expiration
   */
  updateBenefitBeforeExpiration() {
    if (this.benefit < 50) {
      this.benefit += 1;
      if (this.expiresIn < 11) {
        if (this.benefit < 50) {
          this.benefit += 1;
        }
      }
      if (this.expiresIn < 6) {
        if (this.benefit < 50) {
          this.benefit += 1;
        }
      }
    }
  }

  /**
   * Sets benefit to 0 after expiration.
   */
  updateBenefitAfterExpiration() {
    if (this.expiresIn < 0) {
      this.benefit = 0;
    }
  }
}

/**
 * Special drug that never changes.
 * Its benefit and expiration date remain constant.
 */
export class MagicPill extends Drug {
  /**
   * Does nothing - benefit remains unchanged.
   */
  updateBenefitBeforeExpiration() {}

  /**
   * Does nothing - expiration remains unchanged.
   */
  decreaseExpiresIn() {}

  /**
   * Does nothing - benefit remains unchanged.
   */
  updateBenefitAfterExpiration() {}
}

/**
 * Special drug that degrades twice as fast as normal drugs.
 */
export class Dafalgan extends Drug {
  /**
   * Decreases benefit by 2 if greater than 0.
   */
  updateBenefitBeforeExpiration() {
    if (this.benefit > 0) {
      this.benefit = Math.max(0, this.benefit - 2);
    }
  }

  /**
   * Decreases benefit by 4 if expired and greater than 0.
   * This is because:
   * - Normal drugs degrade by 2 after expiration
   * - Dafalgan degrades 2x faster than normal drugs
   * - Therefore, Dafalgan degrades by 4 after expiration
   */
  updateBenefitAfterExpiration() {
    if (this.expiresIn < 0) {
      if (this.benefit > 0) {
        this.benefit = Math.max(0, this.benefit - 2);
      }
    }
  }
}

/**
 * Manages a collection of drugs and their updates.
 */
export class Pharmacy {
  /**
   * Creates a new pharmacy instance.
   * @param {Drug[]} drugs - Array of drugs to manage
   */
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  /**
   * Updates all drugs in the pharmacy.
   * @returns {Drug[]} Updated array of drugs
   */
  updateBenefitValue() {
    for (let i = 0; i < this.drugs.length; i++) {
      const drug = this.drugs[i];
      this._updateDrug(drug);
    }
    return this.drugs;
  }

  /**
   * Updates a single drug using the appropriate drug class.
   * @private
   * @param {Drug} drug - The drug to update
   */
  _updateDrug(drug) {
    let updater;
    switch (drug.name) {
      case "Herbal Tea":
        updater = new HerbalTea(drug.name, drug.expiresIn, drug.benefit);
        break;
      case "Fervex":
        updater = new Fervex(drug.name, drug.expiresIn, drug.benefit);
        break;
      case "Magic Pill":
        updater = new MagicPill(drug.name, drug.expiresIn, drug.benefit);
        break;
      case "Dafalgan":
        updater = new Dafalgan(drug.name, drug.expiresIn, drug.benefit);
        break;
      default:
        updater = new Drug(drug.name, drug.expiresIn, drug.benefit);
    }

    updater.updateBenefit();
    drug.expiresIn = updater.expiresIn;
    drug.benefit = updater.benefit;
  }
}
