const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type, authorization, mcp-protocol-version, mcp-session-id', 'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version' };
const tool = {
 name: 'affiliate_video_pro',
 description: 'Panduan interaktif Affiliate Video Pro dari AI CREATOR PRO. Gunakan saat pengguna ingin membuat hook, skrip affiliate, storyboard, shot list, caption, atau CTA. Jika brief kurang, tanyakan paling banyak dua hal penting dahulu. Jangan membuat klaim produk tanpa bukti.',
 inputSchema: { type: 'object', properties: {
  kebutuhan: { type:'string', description:'Tujuan: ide konten, hook, skrip, storyboard, caption, atau paket lengkap' },
  produk: {type:'string',description:'Nama/jenis produk'},
  fakta_produk: {type:'string',description:'Fitur yang telah diverifikasi, jangan mengarang'},
  audiens: {type:'string',description:'Target penonton'},
  platform: {type:'string',description:'TikTok, Reels atau Shorts'},
  gaya: {type:'string',description:'Gaya penyampaian'},
  durasi: {type:'string',description:'Contoh 15 atau 30 detik'}
 }, required:['kebutuhan'], additionalProperties:false}
};
function json(obj,status=200,extra={}) { return new Response(JSON.stringify(obj),{status,headers:{...headers,...extra}}); }
function result(id,value){return json({jsonrpc:'2.0',id,result:value});}
function error(id,code,message){return json({jsonrpc:'2.0',id,error:{code,message}});}
export default {
 async fetch(request) {
  const url=new URL(request.url);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(url.pathname==='/')return json({service:'AI CREATOR PRO MCP',status:'online',endpoint:'/mcp'});
  if(url.pathname!=='/mcp')return json({error:'Not found'},404);
  if(request.method==='GET')return new Response('MCP endpoint. Send POST JSON-RPC requests.',{status:405,headers:{...headers,Allow:'POST, OPTIONS'}});
  if(request.method!=='POST')return json({error:'Method not allowed'},405);
  let body;try{body=await request.json()}catch{return error(null,-32700,'Invalid JSON')}
  if(!body||body.jsonrpc!=='2.0'||typeof body.method!=='string')return error(body?.id??null,-32600,'Invalid Request');
  if(body.id===undefined)return new Response(null,{status:202,headers});
  if(body.method==='initialize')return result(body.id,{protocolVersion:'2025-03-26',capabilities:{tools:{listChanged:false}},serverInfo:{name:'ai-creator-pro-mcp',version:'1.0.0'}});
  if(body.method==='ping')return result(body.id,{});
  if(body.method==='tools/list')return result(body.id,{tools:[tool]});
  if(body.method==='tools/call') {
   if(body.params?.name!==tool.name)return error(body.id,-32602,'Unknown tool');
   const a=body.params.arguments??{};
   if(typeof a.kebutuhan!=='string'||!a.kebutuhan.trim())return error(body.id,-32602,'kebutuhan is required');
   const items=[['Tujuan',a.kebutuhan],['Produk',a.produk],['Fakta produk yang terverifikasi',a.fakta_produk],['Audiens',a.audiens],['Platform',a.platform],['Gaya',a.gaya],['Durasi',a.durasi]].filter(x=>x[1]&&String(x[1]).trim());
   const output=`AI CREATOR PRO — AFFILIATE VIDEO PRO\n\nBRIEF:\n${items.map(([k,v])=>'- '+k+': '+v).join('\n')}\n\nPANDUAN UNTUK ASISTEN:\nBantu pengguna dalam Bahasa Indonesia yang natural. Jika ada informasi pokok yang kurang, ajukan maksimal dua pertanyaan singkat dan berikan opsi jawaban. Jika cukup, berikan 5 hook, skrip sesuai durasi dalam tabel waktu/visual/narasi/teks layar, shot list yang dapat dibuat dengan HP, voice-over, 3 caption dan CTA. Jika hanya diminta satu bagian, buat bagian itu saja. Jangan mengarang fitur, harga, diskon, testimoni, klaim kesehatan atau janji viral. Tandai asumsi. Tawarkan revisi (lebih santai, 15 detik, 3 variasi, storyboard detail).`;
   return result(body.id,{content:[{type:'text',text:output}],isError:false});
  }
  return error(body.id,-32601,'Method not found');
 }
};
