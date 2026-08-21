import * as crypto from 'crypto';
// Import argon2 as the primary recommendation
// import * as argon2 from 'argon2'; 

export class PasswordService {
  /**
   * Generates a secure, random salt.
   * @returns A 16-byte salt represented as a hex string.
   */
  public static generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Hashes a password using Argon2id (recommended) or fallback pbkdf2 with salt.
   * @param password The plaintext password to hash
   * @param salt The unique salt generated for this user
   * @returns A promise that resolves to the hashed password string
   */
  public static async hashPassword(password: string, salt: string): Promise<string> {
    // ---------------------------------------------------------
    // PRIMARY OPTION: Argon2id (preferred)
    // ---------------------------------------------------------
    // Under the hood, the argon2 library defaults to Argon2id.
    // Recommended configuration:
    // return await argon2.hash(password, {
    //   type: argon2.argon2id,
    //   memoryCost: 65536, // 64 MB
    //   timeCost: 3,       // 3 iterations
    //   parallelism: 4,    // 4 parallel threads
    //   salt: Buffer.from(salt, 'hex'),
    // });

    // ---------------------------------------------------------
    // FALLBACK OPTION: Node.js Native PBKDF2/Scrypt (no compilation needed)
    // ---------------------------------------------------------
    return new Promise((resolve, reject) => {
      // 100,000 iterations, 64 bytes key length, SHA-512
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  /**
   * Verifies if a password matches the stored hash.
   * @param password The plaintext password to verify
   * @param hash The stored hashed password
   * @param salt The stored salt used during hashing
   * @returns True if the credentials are valid, false otherwise
   */
  public static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    // For primary option:
    // try {
    //   return await argon2.verify(hash, password);
    // } catch (err) {
    //   return false;
    // }

    // For fallback option:
    const calculatedHash = await this.hashPassword(password, salt);
    
    // Use timing-safe comparison to prevent timing attacks
    const bufferHash = Buffer.from(hash, 'hex');
    const bufferCalc = Buffer.from(calculatedHash, 'hex');
    
    if (bufferHash.length !== bufferCalc.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(bufferHash, bufferCalc);
  }
}
