import * as bcrypt from 'bcrypt';

export async function hash(data) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.HASH_SALT));
  return await bcrypt.hashSync(data, salt);
}

export async function compareHash(data, dataHash) {
  return await bcrypt.compareSync(data, dataHash);
}
