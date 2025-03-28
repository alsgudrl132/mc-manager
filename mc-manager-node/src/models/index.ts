import sequelize from "../config/database";
import { DataTypes, Model } from "sequelize";

// User 모델 정의
class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public role!: string;
  public lastLogin!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "moderator", "viewer"),
      defaultValue: "viewer",
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

// ServerStatus 모델 정의 (Java 플러그인에서 생성된 테이블과 일치)
class ServerStatus extends Model {
  public id!: number;
  public timestamp!: number;
  public tps!: number;
  public online_players!: number;
  public max_players!: number;
  public used_memory!: number;
  public total_memory!: number;
  public uptime!: string;
}

ServerStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tps: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    online_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_players: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    used_memory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_memory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uptime: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "server_status",
    timestamps: false,
  }
);

// PlayerData 모델 정의
class PlayerData extends Model {
  public id!: number;
  public uuid!: string;
  public name!: string;
  public last_login!: number;
  public last_logout!: number | null;
  public is_online!: boolean;
  public play_time!: number;
}

PlayerData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    last_login: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    last_logout: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    play_time: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "player_data",
    timestamps: false,
  }
);

// PlayerStatus 모델 정의
class PlayerStatus extends Model {
  public id!: number;
  public timestamp!: number;
  public uuid!: string;
  public health!: number;
  public level!: number;
  public world!: string;
  public x!: number;
  public y!: number;
  public z!: number;
}

PlayerStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    health: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    world: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    x: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    y: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    z: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "player_status",
    timestamps: false,
  }
);

// ChatLog 모델 정의
class ChatLog extends Model {
  public id!: number;
  public timestamp!: number;
  public uuid!: string;
  public player_name!: string;
  public message!: string;
}

ChatLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    player_name: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "chat_log",
    timestamps: false,
  }
);

// Backup 모델 정의
class Backup extends Model {
  public id!: number;
  public timestamp!: number;
  public name!: string;
  public path!: string;
  public size!: number;
  public userId!: number;
  public description!: string;
}

Backup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "backups",
    timestamps: false,
  }
);

// CommandLog 모델 정의
class CommandLog extends Model {
  public id!: number;
  public timestamp!: number;
  public userId!: number;
  public command!: string;
  public status!: string;
}

CommandLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    command: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("success", "failure"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "command_log",
    timestamps: false,
  }
);

export {
  User,
  ServerStatus,
  PlayerData,
  PlayerStatus,
  ChatLog,
  CommandLog,
  Backup,
};
