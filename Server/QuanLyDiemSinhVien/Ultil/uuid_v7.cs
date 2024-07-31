namespace asd123.Ultil;

public static class uuid_v7
{
    public static Guid UUID()
    {
        byte[] uuidBytes = new byte[16];

        // Timestamp
        long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        byte[] timestampBytes = BitConverter.GetBytes(timestamp);
        if (BitConverter.IsLittleEndian)
        {
            Array.Reverse(timestampBytes);
        }

        // Set the first 6 bytes to the timestamp
        Array.Copy(timestampBytes, 2, uuidBytes, 0, 6);

        // Set the version to 7
        uuidBytes[6] = (byte)((7 << 4) | (uuidBytes[6] & 0x0F));

        // Set the variant to 1 (binary 10)
        uuidBytes[8] = (byte)((2 << 6) | (uuidBytes[8] & 0x3F));

        // Random part
        byte[] randomBytes = new byte[10];
        Random random = new Random();
        random.NextBytes(randomBytes);

        // Copy random bytes to UUID
        Array.Copy(randomBytes, 0, uuidBytes, 6, 10);

        return new Guid(uuidBytes);
    }
}