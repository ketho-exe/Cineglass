type ProviderProgressMessage = {
  event: string;
  progressSeconds: number;
  durationSeconds?: number;
  progressPercent: number;
  seasonNumber?: number;
  episodeNumber?: number;
};

type MessageObject = Record<string, unknown>;

export function parseProviderProgressMessage(data: unknown): ProviderProgressMessage | null {
  const message = parseMessageObject(data);
  if (!message) return null;

  return parseEmbedMasterMessage(message)
    ?? parseGenericPlayerEvent(message)
    ?? parseVideasyMessage(message);
}

function parseMessageObject(data: unknown): MessageObject | null {
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      return parsed && typeof parsed === "object" ? parsed as MessageObject : null;
    } catch {
      return null;
    }
  }
  return data && typeof data === "object" ? data as MessageObject : null;
}

function parseEmbedMasterMessage(message: MessageObject): ProviderProgressMessage | null {
  if (message.source !== "embedmaster_player") return null;
  const info = message.info && typeof message.info === "object" ? message.info as MessageObject : {};
  return progressFromInfo(String(message.event ?? "progress"), info);
}

function parseGenericPlayerEvent(message: MessageObject): ProviderProgressMessage | null {
  if (message.type !== "PLAYER_EVENT") return null;
  const data = message.data && typeof message.data === "object" ? message.data as MessageObject : {};
  return progressFromInfo(String(data.event ?? "progress"), data);
}

function parseVideasyMessage(message: MessageObject): ProviderProgressMessage | null {
  if (
    message.progress === undefined &&
    message.timestamp === undefined &&
    message.duration === undefined
  ) {
    return null;
  }

  const durationSeconds = positiveNumber(message.duration);
  return {
    event: "progress",
    progressSeconds: Math.floor(Number(message.timestamp ?? 0) || 0),
    durationSeconds: durationSeconds ? Math.floor(durationSeconds) : undefined,
    progressPercent: Number(message.progress ?? 0) || 0,
    seasonNumber: positiveInteger(message.season),
    episodeNumber: positiveInteger(message.episode),
  };
}

function progressFromInfo(event: string, info: MessageObject): ProviderProgressMessage | null {
  const progressSeconds = Number(
    info.currentTime ??
    info.current_time ??
    info.seconds ??
    info.time ??
    info.position ??
    0,
  ) || 0;
  const duration = Number(info.duration ?? 0) || 0;

  if (!progressSeconds && !["play", "pause", "ended", "seeked", "progress"].includes(event)) return null;

  const rawProgressPercent = Number(
    info.percent ?? info.progress ?? (duration ? (progressSeconds / duration) * 100 : 0),
  ) || 0;
  const progressPercent = rawProgressPercent > 0 && rawProgressPercent <= 1
    ? rawProgressPercent * 100
    : rawProgressPercent;

  return {
    event,
    progressSeconds: Math.floor(progressSeconds),
    durationSeconds: duration ? Math.floor(duration) : undefined,
    progressPercent,
  };
}

function positiveNumber(value: unknown) {
  const number = Number(value);
  return number > 0 ? number : undefined;
}

function positiveInteger(value: unknown) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}
