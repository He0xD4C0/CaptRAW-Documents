import { query } from './index';

export interface UserRecord {
  user_uuid: string;
  fediverse_user_id: string;
  user_id: string;
  host_name: string;
  nickname: string;
  avatar_location: string | null;
  email: string | null;
  password_hash: string | null;
  bio: string | null;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  fediverse_user_id?: string;
  user_id: string;
  host_name: string;
  nickname: string;
  avatar_location?: string;
  email?: string;
  password_hash?: string;
  bio?: string;
  role?: string;
}

export interface UpdateUserInput {
  nickname?: string;
  avatar_location?: string;
  email?: string;
  password_hash?: string;
  bio?: string;
  role?: string;
  is_active?: boolean;
}

export interface LoginCredentials {
  email?: string;
  user_id?: string;
  password: string;
}

/**
 * 根据UUID获取用户
 */
export async function getUserByUuid(userUuid: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    'SELECT * FROM users WHERE user_uuid = $1 LIMIT 1',
    [userUuid]
  );
  return result.rows[0] || null;
}

/**
 * 根据用户ID获取用户
 */
export async function getUserById(userId: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    'SELECT * FROM users WHERE user_id = $1 LIMIT 1',
    [userId]
  );
  return result.rows[0] || null;
}

/**
 * 根据邮箱获取用户
 */
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return result.rows[0] || null;
}

/**
 * 根据联邦身份ID获取用户
 */
export async function getUserByFediverseId(fediverseId: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    'SELECT * FROM users WHERE fediverse_user_id = $1 LIMIT 1',
    [fediverseId]
  );
  return result.rows[0] || null;
}

/**
 * 创建用户
 */
export async function createUser(userData: CreateUserInput): Promise<UserRecord> {
  const {
    fediverse_user_id,
    user_id,
    host_name,
    nickname,
    avatar_location = null,
    email = null,
    password_hash = null,
    bio = null,
    role = 'user',
  } = userData;

  // 生成联邦身份ID（如果没有提供）
  const fedId = fediverse_user_id || `@${user_id}@${host_name}`;

  const result = await query<UserRecord>(
    `INSERT INTO users (
      fediverse_user_id, user_id, host_name, nickname, avatar_location,
      email, password_hash, bio, role
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [fedId, user_id, host_name, nickname, avatar_location, email, password_hash, bio, role]
  );
  return result.rows[0];
}

/**
 * 更新用户
 */
export async function updateUser(userUuid: string, userData: UpdateUserInput): Promise<UserRecord | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // 动态构建更新字段
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return null;
  }

  values.push(userUuid);
  
  const result = await query<UserRecord>(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE user_uuid = $${paramCount}
     RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

/**
 * 删除用户
 */
export async function deleteUser(userUuid: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM users WHERE user_uuid = $1 RETURNING user_uuid',
    [userUuid]
  );
  return (result.rowCount || 0) > 0;
}

/**
 * 验证用户登录
 */
export async function verifyUserLogin(credentials: LoginCredentials): Promise<UserRecord | null> {
  const { email, user_id, password } = credentials;
  
  let user: UserRecord | null = null;
  
  // 根据邮箱或用户ID查找用户
  if (email) {
    user = await getUserByEmail(email);
  } else if (user_id) {
    user = await getUserById(user_id);
  }
  
  if (!user) {
    return null;
  }
  
  // 检查密码哈希（这里使用简单的字符串比较，实际应该使用bcrypt等）
  // 注意：password_hash可能是null，特别是联邦用户
  if (user.password_hash && user.password_hash === password) {
    return user;
  }
  
  return null;
}

/**
 * 获取用户列表（带分页）
 */
export async function getUsers(limit: number = 20, offset: number = 0): Promise<UserRecord[]> {
  const result = await query<UserRecord>(
    'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return result.rows;
}

/**
 * 获取用户总数
 */
export async function getUsersCount(): Promise<number> {
  const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM users');
  return parseInt(result.rows[0].count, 10);
}

/**
 * 更新用户最后活动时间
 */
export async function updateUserLastActive(userUuid: string): Promise<boolean> {
  const result = await query(
    'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_uuid = $1 RETURNING user_uuid',
    [userUuid]
  );
  return (result.rowCount || 0) > 0;
}