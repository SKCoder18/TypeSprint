export function mediaKind(file:{name:string;type:string}):'audio'|'video'|null{
 if(file.type.startsWith('audio/'))return 'audio';
 if(file.type.startsWith('video/'))return 'video';
 if(file.type&&file.type!=='application/octet-stream')return null;
 const extension=file.name.split('.').pop()?.toLowerCase()??'';
 if(['mp3','wav','wave','ogg','oga','m4a','aac','flac','opus'].includes(extension))return 'audio';
 if(['mp4','webm','ogv','mov','m4v'].includes(extension))return 'video';
 return null;
}
export function validMediaDuration(duration:number){return Number.isFinite(duration)&&duration>0&&duration<=300;}
