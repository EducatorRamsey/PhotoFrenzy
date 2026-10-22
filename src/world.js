// Feet-based obstacles keep the photographer on the paths and out of the pond.
export const PICNIC_TABLES = [{x:165,y:235},{x:405,y:235},{x:165,y:400},{x:405,y:400}];
export const POND = {x:785,y:280,rx:137,ry:77};
export function canWalk(level,x,y){
 if(x<40||x>960||y<level.minY||y>478)return false;
 if(level.texture!=='courtyard')return true;
 if(((x-POND.x)/(POND.rx+10))**2+((y-POND.y)/(POND.ry+7))**2<1)return false;
 for(const table of PICNIC_TABLES){if(Math.abs(x-table.x)<77&&y>table.y-13&&y<table.y+33)return false;}
 for(const bench of [{x:615,y:187},{x:850,y:437}]){if(Math.abs(x-bench.x)<65&&y>bench.y-15&&y<bench.y+16)return false;}
 return true;
}
