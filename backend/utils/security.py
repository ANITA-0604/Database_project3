# utils/security.py
import os
import hashlib

def hash_password(password, salt=None):
    # Ensure the salt is in bytes; generate if not provided
    if salt is None:
        salt = os.urandom(16)  # Generate a 16-byte random salt
    elif isinstance(salt, str):
        # If salt is a string (e.g., hexadecimal), convert it to bytes
        salt = bytes.fromhex(salt)

    # Concatenate salt and password (both must be bytes)
    pwd_hash = hashlib.sha256(salt + password.encode('utf-8')).hexdigest()

    # Return the salt as a hex string concatenated with the hash
    return salt.hex() + pwd_hash


def verify_password(stored_password, provided_password):
    salt = bytes.fromhex(stored_password[:32])
    stored_hash = stored_password[32:]
    provided_hash = hashlib.sha256(str(salt) + provided_password.encode()).hexdigest()
    return stored_hash == provided_hash
