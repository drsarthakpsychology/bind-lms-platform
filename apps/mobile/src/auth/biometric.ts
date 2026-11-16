/**
 * Biometric unlock (fingerprint or face) is planned for a later release.
 * The lock screen already asks this hook; while `config.biometrics` is false
 * it answers "not available" and the PIN is the only way in. To switch it on:
 * add expo-local-authentication, implement these two functions, set the flag.
 */
export async function biometricAvailable(): Promise<boolean> {
  return false;
}

export async function unlockWithBiometric(): Promise<boolean> {
  return false;
}
