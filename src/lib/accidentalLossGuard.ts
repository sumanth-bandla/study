export interface BackupSnapshot {
  version: string;
  timestamp: string;
  data: any;
}

export const createDataBackup = (data: any): string => {
  const snapshot: BackupSnapshot = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    data
  };
  const jsonStr = JSON.stringify(snapshot, null, 2);
  try {
    localStorage.setItem('STUDYHUB_AUTO_BACKUP_LATEST', jsonStr);
  } catch (e) {
    // quota safe
  }
  return jsonStr;
};

export const downloadBackupFile = (data: any) => {
  const jsonStr = createDataBackup(data);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `StudyHub_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const restoreBackupFromJSON = (jsonString: string): any => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data) throw new Error('Invalid StudyHub backup payload');
    return parsed.data;
  } catch (err) {
    throw new Error('Corrupted or incompatible backup JSON.');
  }
};
