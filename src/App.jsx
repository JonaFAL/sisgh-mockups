import { useState, useEffect } from "react";

// === DATA ===
const TIPOS_DATO = [
  {code:"A",label:"Buleano (Normal/Patológico)",group:"buleano"},
  {code:"B",label:"Buleano (Verdadero/Falso)",group:"buleano"},
  {code:"C",label:"Combo de Opciones",group:"combo"},
  {code:"D",label:"Diagnóstico",group:"simple"},
  {code:"E",label:"Edad (del Paciente)",group:"simple"},
  {code:"F",label:"Fecha",group:"simple"},
  {code:"G",label:"Score Comorbilidad (ACE27)",group:"simple"},
  {code:"H",label:"Hora",group:"simple"},
  {code:"I",label:"Imagen",group:"simple"},
  {code:"J",label:"Signos Vitales",group:"simple"},
  {code:"K",label:"Servicio - Recurso Médico",group:"simple"},
  {code:"L",label:"Laboratorio",group:"simple"},
  {code:"M",label:"Diag. x Imágenes",group:"simple"},
  {code:"N",label:"Numérico",group:"numerico"},
  {code:"O",label:"Estudios Complementarios",group:"simple"},
  {code:"P",label:"Práctica Nomenclada",group:"simple"},
  {code:"Q",label:"Antecedentes",group:"simple"},
  {code:"R",label:"Recurso Médico",group:"simple"},
  {code:"S",label:"Sexo",group:"simple"},
  {code:"T",label:"Texto (con/sin plantilla)",group:"texto"},
  {code:"U",label:"Conclusión (Epicrisis)",group:"texto"},
  {code:"V",label:"Datos Solicitud de OT",group:"simple"},
  {code:"X",label:"Código Sexo (1 Masc/2 Fem)",group:"simple"},
];
const CATEGORIAS = ["Evolución Enfermería","Evolución Médica","Informe Médico","Dato Complementario","Informe Complementario"];
const ESPECIALIDADES = ["INFECTOLOGIA","CLINICA MEDICA","CIRUGIA","KINESIOLOGIA","ENFERMERIA","CARDIOLOGIA","NUTRICION","PSICOLOGIA","TRAUMATOLOGIA","NEUMONOLOGIA"];

const emptyRow = () => ({
  id:"r"+Date.now()+Math.floor(Math.random()*99999),
  titulo:"",item:"",subitem:"",tipoDato:"T",
  obligatorio:false,imprime:true,porDefecto:false,traeUltimoValor:false,decimales:false,
  positivo:"Normal",negativo:"Patológico",rangoMin:"",rangoMax:"",
  opciones:["","","","","",""],
  plantilla:"",soloUna:false,clave:false,
  unidad:"",rangoMinN:"",rangoMaxN:"",
});
const defaultRegistro = () => ({
  id:"reg"+Date.now()+Math.floor(Math.random()*99999),
  estudio:"",titulo:"",especialidad:"INFECTOLOGIA",
  categoria:"Informe Médico",rows:[emptyRow()],
});
const defaultProject = () => ({
  registros:[defaultRegistro()],
  sheetUrl:"",
  colWidths:{titulo:140,item:180,subitem:0,resultado:160}, // subitem 0 = flex
});

// Styles
const F = '"MS Sans Serif","Microsoft Sans Serif",Tahoma,Arial,sans-serif';

// ============================================================
// EDITOR COMPONENTS (only you see these)
// ============================================================
function VBtn({children,onClick,style,active,disabled,small}) {
  return <button onClick={onClick} disabled={disabled} style={{
    fontFamily:F,fontSize:small?"10px":"11px",padding:small?"2px 8px":"3px 12px",
    border:active?"2px inset #808080":"2px outset #dfdfdf",
    background:active?"#a0a0a0":"#c0c0c0",cursor:disabled?"default":"pointer",
    color:disabled?"#808080":"#000",whiteSpace:"nowrap",...style,
  }}>{children}</button>;
}
function VInp({value,onChange,style,placeholder}) {
  return <input type="text" value={value||""} onChange={onChange} placeholder={placeholder}
    style={{fontFamily:F,fontSize:"11px",border:"2px inset #808080",padding:"2px 4px",background:"#fff",...style}} />;
}
function VSel({value,onChange,options,style}) {
  return <select value={value} onChange={onChange} style={{fontFamily:F,fontSize:"11px",border:"2px inset #808080",padding:"1px 2px",background:"#fff",...style}}>
    {options.map(o=>{const v=typeof o==="string"?o:o.value;const l=typeof o==="string"?o:o.label;return<option key={v} value={v}>{l}</option>;})}
  </select>;
}
function VChk({checked,onChange,label}) {
  return <label style={{fontFamily:F,fontSize:"10px",display:"flex",alignItems:"center",gap:"3px",cursor:"pointer",whiteSpace:"nowrap"}}>
    <input type="checkbox" checked={checked} onChange={onChange}/>{label}
  </label>;
}

// Tipo Config Panel
function TipoConfig({row,onChange}) {
  const tipo=TIPOS_DATO.find(t=>t.code===row.tipoDato);
  if(!tipo) return null;
  const upd=(f,v)=>onChange({...row,[f]:v});
  const updOpc=(i,v)=>{const o=[...row.opciones];o[i]=v;onChange({...row,opciones:o});};
  const box={background:"#f0f0e8",border:"1px solid #808080",padding:"8px 10px",marginTop:"4px",fontFamily:F,fontSize:"10px"};
  const mi={fontFamily:F,fontSize:"10px",border:"1px inset #808080",padding:"2px 4px",background:"#fff",color:"#000"};

  if(tipo.group==="buleano") return <div style={box}>
    <div style={{fontWeight:"bold",marginBottom:"6px",color:"#000080"}}>🔘 Buleano</div>
    <div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Positivo</div><input type="text" value={row.positivo||""} onChange={e=>upd("positivo",e.target.value)} style={{...mi,width:"100px"}}/></div>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Negativo</div><input type="text" value={row.negativo||""} onChange={e=>upd("negativo",e.target.value)} style={{...mi,width:"100px"}}/></div>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Rango Mín</div><input type="text" value={row.rangoMin||""} onChange={e=>upd("rangoMin",e.target.value)} style={{...mi,width:"70px"}}/></div>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Rango Máx</div><input type="text" value={row.rangoMax||""} onChange={e=>upd("rangoMax",e.target.value)} style={{...mi,width:"70px"}}/></div>
    </div>
  </div>;

  if(tipo.group==="combo") return <div style={box}>
    <div style={{fontWeight:"bold",marginBottom:"6px",color:"#000080"}}>📋 Opciones del Combo</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px"}}>
      {row.opciones.map((op,i)=><div key={i}><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Opción {i+1}</div>
        <input type="text" value={op||""} onChange={e=>updOpc(i,e.target.value)} style={{...mi,width:"100%"}} placeholder={`Opción ${i+1}...`}/></div>)}
    </div>
    {row.opciones.filter(o=>o&&o.trim()).length>0&&<div style={{marginTop:"6px",fontSize:"9px",color:"#666"}}>Preview: [{row.opciones.filter(o=>o&&o.trim()).join(" | ")}]</div>}
  </div>;

  if(tipo.group==="texto") return <div style={box}>
    <div style={{fontWeight:"bold",marginBottom:"6px",color:"#000080"}}>📝 Texto</div>
    <div style={{display:"flex",gap:"16px",alignItems:"start",flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:"200px"}}><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Plantilla</div>
        <textarea value={row.plantilla||""} onChange={e=>upd("plantilla",e.target.value)} rows={2} style={{...mi,width:"100%",resize:"vertical"}} placeholder="Texto predeterminado..."/></div>
      <div style={{display:"flex",flexDirection:"column",gap:"4px",paddingTop:"14px"}}>
        <VChk checked={row.soloUna} onChange={e=>upd("soloUna",e.target.checked)} label="Solo Una"/>
        <VChk checked={row.clave} onChange={e=>upd("clave",e.target.checked)} label="Clave"/>
      </div>
    </div>
  </div>;

  if(tipo.group==="numerico") return <div style={box}>
    <div style={{fontWeight:"bold",marginBottom:"6px",color:"#000080"}}>🔢 Numérico</div>
    <div style={{display:"flex",gap:"16px",flexWrap:"wrap",alignItems:"end"}}>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Unidad</div><input type="text" value={row.unidad||""} onChange={e=>upd("unidad",e.target.value)} style={{...mi,width:"80px"}} placeholder="mg/dl"/></div>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Mín</div><input type="text" value={row.rangoMinN||""} onChange={e=>upd("rangoMinN",e.target.value)} style={{...mi,width:"70px"}}/></div>
      <div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Máx</div><input type="text" value={row.rangoMaxN||""} onChange={e=>upd("rangoMaxN",e.target.value)} style={{...mi,width:"70px"}}/></div>
      <VChk checked={row.decimales} onChange={e=>upd("decimales",e.target.checked)} label="Decimales"/>
    </div>
  </div>;

  return <div style={{...box,background:"#f8f8f0"}}><span style={{color:"#666"}}>ℹ️ {tipo.code} - {tipo.label}: sin config adicional.</span></div>;
}

// Import Modal
function ImportModal({onClose,onImport}) {
  const[text,setText]=useState("");const[sep,setSep]=useState("tab");
  const parse=(raw,s)=>{const d=s==="tab"?"\t":s==="semicolon"?";":","
    return raw.trim().split("\n").filter(l=>l.trim()).map(line=>{const c=line.split(d).map(x=>x.trim());const tc=(c[3]||"T").toUpperCase();const vt=TIPOS_DATO.find(t=>t.code===tc);
    return{titulo:c[0]||"",item:c[1]||"",subitem:c[2]||"",tipoDato:vt?vt.code:"T",obligatorio:["S","SI","TRUE"].includes((c[4]||"").toUpperCase())};});};
  const preview=text?parse(text,sep):[];
  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#c0c0c0",border:"2px outset #dfdfdf",width:"680px",maxWidth:"95vw",maxHeight:"90vh",display:"flex",flexDirection:"column",fontFamily:F,fontSize:"11px"}}>
      <div style={{background:"linear-gradient(90deg,#000080,#1084d0)",color:"#fff",fontWeight:"bold",padding:"3px 6px"}}>📋 Importar desde Excel</div>
      <div style={{padding:"10px",overflow:"auto",flex:1}}>
        <div style={{background:"#ffffcc",border:"1px solid #cc9900",padding:"6px",marginBottom:"8px",fontSize:"10px"}}>Columnas: <b>Título | Item | SubItem | TipoDato (letra) | Obligatorio (S/N)</b></div>
        <div style={{display:"flex",gap:"12px",marginBottom:"6px"}}>{[["tab","Tab (Excel)"],["semicolon",";"],["comma",","]].map(([v,l])=>
          <label key={v} style={{display:"flex",alignItems:"center",gap:"3px",fontSize:"10px",cursor:"pointer"}}><input type="radio" checked={sep===v} onChange={()=>setSep(v)}/>{l}</label>)}</div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Pegá acá las filas..." style={{width:"100%",height:"100px",fontFamily:"Consolas,monospace",fontSize:"10px",border:"2px inset #808080",padding:"4px",resize:"vertical"}}/>
        {preview.length>0&&<div style={{marginTop:"8px"}}><b style={{color:"#000080"}}>{preview.length} filas</b>
          <div style={{border:"2px inset #808080",background:"#fff",marginTop:"4px",maxHeight:"150px",overflowY:"auto",fontSize:"10px"}}>
            {preview.map((r,i)=><div key={i} style={{display:"flex",gap:"8px",padding:"2px 4px",borderBottom:"1px solid #eee"}}><span style={{color:"#800000",fontWeight:"bold",width:"20px"}}>{i+1}</span><span style={{flex:1,fontWeight:"bold"}}>{r.titulo||"—"}</span><span style={{flex:1}}>{r.item||"—"}</span><span><span style={{background:"#e0e0ff",padding:"0 3px",fontSize:"9px"}}>{r.tipoDato}</span></span></div>)}
          </div></div>}
      </div>
      <div style={{display:"flex",gap:"6px",justifyContent:"flex-end",padding:"8px",borderTop:"1px solid #808080"}}>
        <VBtn onClick={onClose} small>Cancelar</VBtn>
        <VBtn disabled={!preview.length} onClick={()=>{onImport(preview);onClose();}} small style={{background:"#d0d0ff",fontWeight:"bold"}}>✅ Importar {preview.length}</VBtn>
      </div>
    </div>
  </div>;
}

// Registro Editor
function RegistroEditor({registro,setRegistro}) {
  const[expRow,setExpRow]=useState(null);const[showImport,setShowImport]=useState(false);
  const upd=(f,v)=>setRegistro({...registro,[f]:v});
  const updRow=(i,f,v)=>{const r=[...registro.rows];r[i]={...r[i],[f]:v};setRegistro({...registro,rows:r});};
  const updRowFull=(i,nr)=>{const r=[...registro.rows];r[i]=nr;setRegistro({...registro,rows:r});};
  const addRow=()=>{setRegistro({...registro,rows:[...registro.rows,emptyRow()]});setExpRow(registro.rows.length);};
  const removeRow=i=>{setRegistro({...registro,rows:registro.rows.filter((_,j)=>j!==i)});if(expRow===i)setExpRow(null);};
  const moveRow=(i,d)=>{const r=[...registro.rows];const n=i+d;if(n<0||n>=r.length)return;[r[i],r[n]]=[r[n],r[i]];setRegistro({...registro,rows:r});if(expRow===i)setExpRow(n);};
  const dupRow=i=>{const r=[...registro.rows];r.splice(i+1,0,{...r[i],id:"r"+Date.now()+Math.floor(Math.random()*99999)});setRegistro({...registro,rows:r});setExpRow(i+1);};

  return <div>
    <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 1fr",gap:"4px 8px",alignItems:"center",marginBottom:"6px"}}>
      <b>Estudio</b><VInp value={registro.estudio} onChange={e=>upd("estudio",e.target.value)} placeholder="AISLAMIENTO - RESPIRATORIO AÉREO" style={{width:"100%"}}/>
      <b>Categoría</b><VSel value={registro.categoria} onChange={e=>upd("categoria",e.target.value)} options={CATEGORIAS}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 1fr",gap:"4px 8px",alignItems:"center",marginBottom:"6px"}}>
      <b>Título</b><VInp value={registro.titulo} onChange={e=>upd("titulo",e.target.value)} placeholder="COMITE DE CONTROL DE INFECCIONES" style={{width:"100%"}}/>
      <b>Especialidad</b><VSel value={registro.especialidad} onChange={e=>upd("especialidad",e.target.value)} options={ESPECIALIDADES}/>
    </div>
    <div style={{display:"flex",gap:"4px",marginBottom:"4px",flexWrap:"wrap"}}>
      <VBtn onClick={addRow} small>➕ Fila</VBtn>
      <VBtn onClick={()=>setShowImport(true)} small style={{background:"#e8ffe8"}}>📋 Importar Excel</VBtn>
      <div style={{flex:1}}/><span style={{fontSize:"10px",color:"#666"}}>{registro.rows.length} filas — ▶ para config</span>
    </div>
    <div style={{border:"2px groove #c0c0c0",background:"#fff",marginBottom:"6px"}}>
      <div style={{display:"grid",gridTemplateColumns:"26px 28px 26px 1fr 1fr 1fr 150px 34px",background:"#0000a8",color:"#fff",fontSize:"9px",fontWeight:"bold"}}>
        {["","#","","Título","Item","SubItem","Tipo de Dato","Obl."].map((h,i)=><div key={i} style={{padding:"3px 2px",borderRight:"1px solid #4040c0",textAlign:"center"}}>{h}</div>)}
      </div>
      <div style={{maxHeight:"350px",overflowY:"auto"}}>
        {registro.rows.map((row,idx)=>{const isExp=expRow===idx;const ti=TIPOS_DATO.find(t=>t.code===row.tipoDato);return<div key={row.id}>
          <div style={{display:"grid",gridTemplateColumns:"26px 28px 26px 1fr 1fr 1fr 150px 34px",borderBottom:`1px solid ${isExp?"#000080":"#e0e0e0"}`,minHeight:"26px",fontSize:"10px",background:isExp?"#e0e0ff":idx%2?"#f8f8f8":"#fff"}}>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",borderRight:"1px solid #e0e0e0"}}><span onClick={()=>moveRow(idx,-1)} style={{cursor:"pointer",fontSize:"8px"}}>▲</span><span onClick={()=>moveRow(idx,1)} style={{cursor:"pointer",fontSize:"8px"}}>▼</span></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0",color:"#800000",fontWeight:"bold"}}>{idx+1}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0"}}><span onClick={()=>setExpRow(isExp?null:idx)} style={{cursor:"pointer",fontSize:"11px",fontWeight:"bold",color:"#000080",transform:isExp?"rotate(90deg)":"none",display:"inline-block",transition:"transform 0.15s"}}>▶</span></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px"}}><input type="text" value={row.titulo||""} onChange={e=>updRow(idx,"titulo",e.target.value)} style={{width:"100%",border:"none",fontSize:"10px",fontFamily:F,background:"transparent",padding:"2px",color:"#000"}} placeholder="Título..."/></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px"}}><input type="text" value={row.item||""} onChange={e=>updRow(idx,"item",e.target.value)} style={{width:"100%",border:"none",fontSize:"10px",fontFamily:F,background:"transparent",padding:"2px",color:"#000"}} placeholder="Item..."/></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px"}}><input type="text" value={row.subitem||""} onChange={e=>updRow(idx,"subitem",e.target.value)} style={{width:"100%",border:"none",fontSize:"9px",fontFamily:F,background:"transparent",padding:"2px",color:"#000"}} placeholder="SubItem..."/></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px 2px",display:"flex",alignItems:"center"}}><select value={row.tipoDato} onChange={e=>{updRow(idx,"tipoDato",e.target.value);setExpRow(idx);}} style={{width:"100%",fontSize:"9px",fontFamily:F,border:"1px solid #999",padding:"1px"}}>{TIPOS_DATO.map(t=><option key={t.code} value={t.code}>{t.code} - {t.label}</option>)}</select></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}><input type="checkbox" checked={row.obligatorio} onChange={e=>updRow(idx,"obligatorio",e.target.checked)}/></div>
          </div>
          {isExp&&<div style={{background:"#f0f0f8",borderBottom:"2px solid #000080",padding:"8px 10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}><span style={{fontWeight:"bold",fontSize:"11px",color:"#000080"}}>⚙️ {ti?.code} - {ti?.label}</span><div style={{display:"flex",gap:"3px"}}><VBtn small onClick={()=>dupRow(idx)}>📋</VBtn><VBtn small onClick={()=>removeRow(idx)} style={{color:"#800000"}}>🗑️</VBtn></div></div>
            <div style={{display:"flex",gap:"10px",marginBottom:"4px",flexWrap:"wrap"}}><VChk checked={row.porDefecto} onChange={e=>updRow(idx,"porDefecto",e.target.checked)} label="Por Defecto"/><VChk checked={row.traeUltimoValor} onChange={e=>updRow(idx,"traeUltimoValor",e.target.checked)} label="Trae Último Valor"/></div>
            <TipoConfig row={row} onChange={nr=>updRowFull(idx,nr)}/>
          </div>}
        </div>;})}
        {!registro.rows.length&&<div style={{padding:"20px",textAlign:"center",color:"#808080"}}>Sin filas</div>}
      </div>
    </div>
    {showImport&&<ImportModal onClose={()=>setShowImport(false)} onImport={imported=>setRegistro({...registro,rows:[...registro.rows,...imported.map(r=>({...emptyRow(),...r,id:"r"+Date.now()+Math.floor(Math.random()*99999)}))]}) }/>}
  </div>;
}


// ============================================================
// USER VIEWER — Pixel-perfect SISGH/VFP aesthetic
// No editor UI, no modern buttons, pure VFP look
// ============================================================

function SisghRegistroView({registro, sheetUrl, onBack, colWidths}) {
  const cw = colWidths || {titulo:140,item:180,subitem:0,resultado:160};
  const gridCols = `${cw.titulo}px ${cw.item}px 1fr 22px 22px ${cw.resultado}px`;
  const [commentMode, setCommentMode] = useState(false);
  const [comments, setComments] = useState({});
  const [popup, setPopup] = useState(null);
  const [popupType, setPopupType] = useState("corregir");
  const [popupText, setPopupText] = useState("");
  const [showSend, setShowSend] = useState(false);
  const [sender, setSender] = useState("");
  const [nota, setNota] = useState("");
  const [sending, setSending] = useState(false);
  const cc = Object.keys(comments).length;

  const openPopup = (field, e) => {
    if (!commentMode) return;
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setPopup({field, x:Math.min(r.left,window.innerWidth-330), y:Math.min(r.bottom+4,window.innerHeight-220)});
    setPopupType(comments[field]?.type||"corregir");
    setPopupText(comments[field]?.text||"");
  };
  const saveComment = () => {
    if (!popupText.trim()) return;
    setComments(c=>({...c,[popup.field]:{type:popupType,text:popupText.trim()}}));
    setPopup(null);
  };
  const removeComment = () => {
    setComments(c=>{const n={...c};delete n[popup.field];return n;});
    setPopup(null);
  };
  const sendToSheet = async () => {
    if (!sheetUrl) {alert("⚠️ Error de configuración. Contacte al administrador."); return;}
    if (!sender.trim()) {alert("Por favor ingrese su nombre."); return;}
    setSending(true);
    try {
      await fetch(sheetUrl,{method:"POST",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify({
          action:"comment", revisor:sender, estudio:registro.estudio||"(sin estudio)",
          notaGeneral:nota, comments:Object.entries(comments).map(([campo,d])=>({campo,tipo:d.type,texto:d.text})),
        }),redirect:"follow"});
      alert("✅ Comentarios enviados correctamente. ¡Gracias!");
      setComments({}); setShowSend(false);
    } catch { alert("❌ Error al enviar."); }
    setSending(false);
  };

  const renderResultado = (row) => {
    const tipo = TIPOS_DATO.find(t=>t.code===row.tipoDato);
    if (!tipo) return null;
    if (tipo.group==="buleano") return <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"10px",fontFamily:F}}>
      <label style={{display:"flex",alignItems:"center",gap:"2px",cursor:"pointer"}}><input type="radio" name={`bool_${row.id}`}/>{row.positivo||"Normal"}</label>
      <label style={{display:"flex",alignItems:"center",gap:"2px",cursor:"pointer"}}><input type="radio" name={`bool_${row.id}`}/>{row.negativo||"Patológico"}</label>
    </div>;
    if (tipo.group==="combo") {
      const opts=(row.opciones||[]).filter(o=>o&&o.trim());
      return opts.length ? <select style={{fontFamily:F,fontSize:"10px",border:"1px inset #808080",width:"100%",background:"#fff"}}><option>Seleccionar...</option>{opts.map((o,i)=><option key={i}>{o}</option>)}</select>
        : null;
    }
    if (tipo.group==="texto") return <input type="text" defaultValue={row.plantilla||""} style={{border:"1px inset #808080",background:"#fff",padding:"1px 3px",width:"100%",minHeight:"16px",color:"#000",fontSize:"9px",fontFamily:F}} placeholder="Ingrese texto..."/>;
    if (tipo.group==="numerico") return <div style={{display:"flex",gap:"3px",alignItems:"center",fontSize:"10px",fontFamily:F}}>
      <input type="text" defaultValue="" style={{border:"1px inset #808080",background:"#fff",padding:"1px 3px",width:"50px",textAlign:"right",color:"#000",fontSize:"10px",fontFamily:F}} placeholder={`0${row.decimales?".00":""}`}/>
      {row.unidad&&<span style={{fontSize:"9px",color:"#555"}}>{row.unidad}</span>}
    </div>;
    return <input type="text" defaultValue="" style={{border:"1px inset #808080",background:"#fff",padding:"1px 3px",width:"100%",minHeight:"16px",color:"#000",fontSize:"9px",fontFamily:F}} placeholder=""/>;
  };

  // Commentable cell
  const C = ({field,children,style}) => <div
    onClick={e=>openPopup(field,e)}
    style={{...style, position:"relative", cursor:commentMode?"pointer":"default",
      outline:comments[field]?"2px solid #ff4400":"none"}}
    onMouseEnter={e=>{if(commentMode)e.currentTarget.style.outline="2px solid #ff8800";}}
    onMouseLeave={e=>{e.currentTarget.style.outline=comments[field]?"2px solid #ff4400":"none";}}>
    {children}
    {comments[field]&&<span style={{position:"absolute",top:0,right:1,fontSize:"9px"}}>💬</span>}
  </div>;

  const tc = {corregir:{bg:"#ffcccc",c:"#800000"},sugerir:{bg:"#ccccff",c:"#000080"},consulta:{bg:"#ccffcc",c:"#008000"},agregar:{bg:"#ffe0cc",c:"#804000"}};

  // The entire viewer is styled to look exactly like SISGH VFP
  return <div style={{fontFamily:F,fontSize:"11px",background:"#c0c0c0",minHeight:"100vh",padding:"2px"}}>

    {/* Thin review toolbar - minimal, doesn't break SISGH look */}
    <div style={{display:"flex",gap:"3px",padding:"2px 4px",background:"#c0c0c0",borderBottom:"1px solid #808080",marginBottom:"2px",alignItems:"center",flexWrap:"wrap"}}>
      {onBack && <><button onClick={onBack} style={{fontFamily:F,fontSize:"10px",padding:"1px 8px",border:"2px outset #dfdfdf",background:"#c0c0c0",cursor:"pointer"}}>← Volver</button>
        <div style={{width:"1px",height:"14px",background:"#808080",margin:"0 3px"}}/></>}
      <button onClick={()=>setCommentMode(!commentMode)} style={{fontFamily:F,fontSize:"10px",padding:"1px 8px",border:commentMode?"2px inset #808080":"2px outset #dfdfdf",background:commentMode?"#ffffcc":"#c0c0c0",cursor:"pointer",fontWeight:commentMode?"bold":"normal"}}>
        {commentMode?"✓ Revisión activa":"Modo Revisión"}
      </button>
      {cc>0&&<><div style={{width:"1px",height:"14px",background:"#808080",margin:"0 3px"}}/>
        <button onClick={()=>setShowSend(true)} style={{fontFamily:F,fontSize:"10px",padding:"1px 8px",border:"2px outset #dfdfdf",background:"#c0c0c0",cursor:"pointer"}}>Enviar ({cc})</button></>}
      <div style={{flex:1}}/>
      {cc>0&&<span style={{fontSize:"9px",color:"#000080"}}>{cc} comentario{cc!==1?"s":""}</span>}
    </div>

    {commentMode&&<div style={{background:"#ffffcc",border:"1px solid #ccaa00",padding:"3px 8px",marginBottom:"2px",fontSize:"10px",color:"#665500"}}>
      Modo revisión activo — haga clic en cualquier celda para agregar un comentario
    </div>}

    {/* === SISGH WINDOW === */}
    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0"}}>
      {/* Title bar — exact SISGH gradient */}
      <div style={{background:"linear-gradient(90deg,#000080,#1084d0)",color:"#fff",fontWeight:"bold",fontSize:"11px",padding:"3px 6px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>{registro.estudio||"ESTUDIO"} - {registro.titulo||""} - Muestra: 1 - Modalidad: {registro.categoria||"INFORME"}</span>
        <div style={{display:"flex",gap:"2px"}}>
          {["_","□","✕"].map(b=><button key={b} style={{width:"16px",height:"14px",fontSize:"8px",fontWeight:"bold",background:"#c0c0c0",border:"2px outset #dfdfdf",display:"flex",alignItems:"center",justifyContent:"center",padding:0,cursor:"default"}}>{b}</button>)}
        </div>
      </div>

      <div style={{padding:"6px 8px"}}>
        {/* Patient header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",border:"1px solid #808080",marginBottom:"4px"}}>
          <div style={{padding:"4px 8px",borderRight:"1px solid #808080"}}>
            <div style={{color:"#008080",fontSize:"9px"}}>Paciente</div>
            <div style={{fontSize:"20px",fontWeight:"bold",lineHeight:1.2}}>Ejemplo, Paciente</div>
            <div style={{display:"flex",gap:"8px",marginTop:"4px"}}>
              <span><span style={{color:"#008080",fontSize:"10px"}}>Nº HC:</span> <span style={{fontWeight:"bold"}}>84869</span></span>
              <span><span style={{color:"#008080",fontSize:"10px"}}>Edad:</span> <span style={{fontWeight:"bold"}}>89</span></span>
              <span><span style={{color:"#008080",fontSize:"10px"}}>Sexo:</span> <span style={{fontWeight:"bold"}}>Fem</span></span>
            </div>
          </div>
          <div style={{padding:"4px 8px",borderRight:"1px solid #808080"}}>
            <div style={{color:"#008080",fontSize:"9px"}}>Orden</div>
            <div style={{fontWeight:"bold"}}>00001482</div>
            <div style={{fontSize:"10px"}}>Confeccionó</div>
          </div>
          <div style={{padding:"4px 8px",borderRight:"1px solid #808080",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button style={{fontFamily:F,fontSize:"10px",fontWeight:"bold",padding:"4px 10px",border:"2px outset #dfdfdf",background:"#c0c0c0",textAlign:"center",lineHeight:1.3,cursor:"default"}}>Problemas/Diagnosticos<br/>Asociados</button>
          </div>
          <div style={{padding:"4px 8px"}}>
            <div style={{color:"#008080",fontSize:"9px"}}>Fecha:</div>
            <div style={{fontWeight:"bold",color:"#ff0000",fontSize:"13px"}}>{new Date().toLocaleString("es-AR")}</div>
          </div>
        </div>

        {/* Firma */}
        <div style={{fontWeight:"bold",fontSize:"10px",marginBottom:"4px"}}>
          Firma / Validación <span style={{display:"inline-block",width:"200px",borderBottom:"1px solid #000",marginLeft:"4px",verticalAlign:"middle"}}/>
        </div>

        {/* === DATA GRID === */}
        <div style={{border:"2px inset #808080",background:"#fff"}}>
          {/* Grid header */}
          <div style={{display:"grid",gridTemplateColumns:gridCols,background:"#0000a8",color:"#fff",fontWeight:"bold",fontSize:"10px"}}>
            {["Título","Item","SubItem","P","R","Resultado"].map(h=><div key={h} style={{padding:"3px 4px",borderRight:"1px solid #4040c0",textAlign:"center",whiteSpace:"nowrap"}}>{h}</div>)}
          </div>

          {/* Grid rows */}
          <div style={{minHeight:"200px"}}>
            {registro.rows.map((row,idx) => {
              const fp = `${row.titulo||"Fila "+(idx+1)}`;
              return <div key={row.id} style={{display:"grid",gridTemplateColumns:gridCols,borderBottom:"1px solid #c0c0c0",minHeight:"24px"}}>
                <C field={`${fp} > Título`} style={{padding:"2px 4px",borderRight:"1px solid #e0e0e0",background:"#ffff80",fontWeight:"bold",fontSize:"10px"}}>
                  {row.titulo||""}
                </C>
                <C field={`${fp} > Item`} style={{padding:"2px 4px",borderRight:"1px solid #e0e0e0",background:"#ffff80",fontSize:"10px"}}>
                  {row.item||""}
                </C>
                <C field={`${fp} > SubItem`} style={{padding:"2px 4px",borderRight:"1px solid #e0e0e0",background:"#ffff80",fontSize:"9px",lineHeight:1.3,wordWrap:"break-word",overflow:"hidden"}}>
                  {row.subitem||""}
                </C>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0",background:"#ffff80"}}>
                  <div style={{width:"12px",height:"12px",background:row.obligatorio?"#e0e0ff":"#fff",border:"1px inset #808080",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px"}}>▼</div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0",background:"#ffff80"}}>
                  <div style={{width:"12px",height:"12px",background:"#fff",border:"1px inset #808080",fontSize:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>□</div>
                </div>
                <C field={`${fp} > Resultado`} style={{padding:"2px 4px",background:"#ffcccc"}}>
                  {renderResultado(row)}
                </C>
              </div>;
            })}
            {/* Empty padding rows */}
            {Array.from({length:Math.max(0,6-registro.rows.length)}).map((_,i)=>
              <div key={`pad${i}`} style={{display:"grid",gridTemplateColumns:gridCols,height:"24px"}}>
                {[0,1,2,3,4,5].map(j=><div key={j} style={{borderRight:j<5?"1px solid #e8e8e8":"none"}}/>)}
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 4px",marginTop:"4px",border:"2px inset #808080",fontSize:"9px"}}>
          <div style={{display:"flex",gap:"8px"}}>
            {[["#00a000","Obligatorio"],["#c0c000","Incompleto"],["#ff0000","Fuera de Rango Crítico"],["#808080","Por Defecto"],["#0000ff","Fórmula"],["#fff","Trae Ultimo Valor"]].map(([c,l])=>
              <span key={l} style={{display:"flex",alignItems:"center",gap:"2px"}}><span style={{width:"8px",height:"8px",borderRadius:"50%",background:c,display:"inline-block",border:c==="#fff"?"1px solid #808080":"none"}}/>{l}</span>
            )}
          </div>
          <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
            <span>[+] / [F2] Plantillas de Informes [F3] Borra Resultado</span>
            <label style={{display:"flex",alignItems:"center",gap:"3px"}}><input type="checkbox" checked disabled/>Impresora</label>
          </div>
        </div>
      </div>
    </div>

    {/* Comment popup */}
    {popup&&<div style={{position:"fixed",left:popup.x,top:popup.y,zIndex:1000,background:"#ffffee",border:"2px outset #dfdfdf",padding:"8px",boxShadow:"3px 3px 6px rgba(0,0,0,0.3)",width:"310px",fontFamily:F,fontSize:"11px"}}>
      <div style={{fontWeight:"bold",fontSize:"10px",color:"#000080",marginBottom:"4px"}}>{popup.field}</div>
      <select value={popupType} onChange={e=>setPopupType(e.target.value)} style={{width:"100%",fontSize:"11px",border:"2px inset #808080",marginBottom:"6px",padding:"2px",fontFamily:F}}>
        <option value="corregir">🔴 Corregir / Está mal</option>
        <option value="sugerir">🔵 Sugerencia de cambio</option>
        <option value="consulta">🟢 Consulta / No entiendo</option>
        <option value="agregar">🟠 Falta agregar algo</option>
      </select>
      <textarea value={popupText} onChange={e=>setPopupText(e.target.value)} autoFocus placeholder="Escriba su comentario..." style={{width:"100%",height:"60px",fontFamily:F,fontSize:"11px",border:"2px inset #808080",padding:"3px",resize:"vertical"}}/>
      <div style={{display:"flex",gap:"4px",marginTop:"6px",justifyContent:"flex-end"}}>
        <button onClick={()=>setPopup(null)} style={{fontFamily:F,fontSize:"10px",padding:"2px 12px",border:"2px outset #dfdfdf",background:"#c0c0c0",cursor:"pointer"}}>Cancelar</button>
        {comments[popup.field]&&<button onClick={removeComment} style={{fontFamily:F,fontSize:"10px",padding:"2px 12px",border:"2px outset #dfdfdf",background:"#c0c0c0",cursor:"pointer",color:"#800000"}}>Eliminar</button>}
        <button onClick={saveComment} style={{fontFamily:F,fontSize:"10px",padding:"2px 12px",border:"2px outset #dfdfdf",background:"#c0c0c0",cursor:"pointer",fontWeight:"bold"}}>Guardar</button>
      </div>
    </div>}

    {/* Send panel */}
    {showSend&&<div style={{border:"2px outset #dfdfdf",background:"#d4d0c8",padding:"10px",marginTop:"4px",fontFamily:F,fontSize:"11px"}}>
      <div style={{fontWeight:"bold",fontSize:"11px",color:"#000080",marginBottom:"6px",borderBottom:"1px solid #808080",paddingBottom:"4px"}}>Enviar comentarios de revisión</div>
      <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"6px"}}><b style={{minWidth:"60px"}}>Nombre:</b><input type="text" value={sender} onChange={e=>setSender(e.target.value)} placeholder="Su nombre..." style={{flex:1,fontFamily:F,fontSize:"11px",border:"2px inset #808080",padding:"2px 4px"}}/></div>
      <div style={{display:"flex",gap:"6px",alignItems:"start",marginBottom:"6px"}}><b style={{minWidth:"60px",paddingTop:"4px"}}>Nota:</b><textarea value={nota} onChange={e=>setNota(e.target.value)} placeholder="Comentario general (opcional)..." style={{flex:1,fontFamily:F,fontSize:"11px",border:"2px inset #808080",padding:"2px 4px",height:"36px"}}/></div>
      <div style={{background:"#fff",border:"2px inset #808080",padding:"6px",maxHeight:"140px",overflowY:"auto",fontSize:"10px"}}>
        {Object.entries(comments).map(([f,d])=><div key={f} style={{padding:"2px 0",borderBottom:"1px dotted #c0c0c0"}}>
          <b style={{color:"#000080"}}>{f}</b> <span style={{display:"inline-block",padding:"0 4px",fontSize:"9px",fontWeight:"bold",borderRadius:"2px",background:tc[d.type]?.bg,color:tc[d.type]?.c}}>{d.type.toUpperCase()}</span><br/>{d.text}
        </div>)}
      </div>
      <div style={{display:"flex",gap:"4px",marginTop:"8px",justifyContent:"flex-end"}}>
        <button onClick={()=>setShowSend(false)} style={{fontFamily:F,fontSize:"11px",padding:"2px 16px",border:"2px outset #dfdfdf",background:"#c0c0c0",cursor:"pointer"}}>Cancelar</button>
        <button onClick={sendToSheet} disabled={sending} style={{fontFamily:F,fontSize:"11px",padding:"2px 16px",border:"2px outset #dfdfdf",background:"#d0d0ff",cursor:"pointer",fontWeight:"bold"}}>{sending?"Enviando...":"Enviar"}</button>
      </div>
    </div>}
  </div>;
}

// HCE Portal for user
function SisghHCEPortal({project, onSelectRegistro}) {
  return <div style={{fontFamily:F,fontSize:"11px",background:"#c0c0c0",minHeight:"100vh",padding:"2px"}}>
    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0"}}>
      <div style={{background:"linear-gradient(90deg,#000080,#1084d0)",color:"#fff",fontWeight:"bold",fontSize:"11px",padding:"3px 6px"}}>
        HCE - Historia Clínica Electrónica
      </div>
      <div style={{padding:"8px"}}>
        {/* Patient header */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",border:"1px solid #808080",marginBottom:"8px",background:"#c0c0c0"}}>
          <div style={{padding:"6px 10px",borderRight:"1px solid #808080"}}>
            <div style={{color:"#008080",fontSize:"9px"}}>Paciente</div>
            <div style={{fontSize:"20px",fontWeight:"bold"}}>Ejemplo, Paciente</div>
            <div style={{display:"flex",gap:"12px",marginTop:"4px",fontSize:"10px"}}>
              <span><span style={{color:"#008080"}}>Nº HC:</span> <b>84869</b></span>
              <span><span style={{color:"#008080"}}>Edad:</span> <b>89</b></span>
              <span><span style={{color:"#008080"}}>Fecha Ncto:</span> <b>13/09/1936</b></span>
              <span><span style={{color:"#008080"}}>Sexo:</span> <b>Fem</b></span>
            </div>
          </div>
          <div style={{padding:"6px 10px",fontSize:"10px"}}>
            <div style={{color:"#008080",fontSize:"9px",fontWeight:"bold"}}>Internación</div>
            <div><b>Episodio:</b> 511471</div>
            <div><b>Ingreso:</b> 15/12/2025</div>
            <div><b>Ubicación:</b> PRIMER P. NVO.</div>
            <div><b>Cant Días:</b> 103</div>
          </div>
        </div>

        {/* Evoluciones */}
        <div style={{border:"2px groove #c0c0c0",padding:"4px"}}>
          <div style={{fontWeight:"bold",padding:"2px 4px",borderBottom:"1px solid #808080",marginBottom:"4px"}}>
            Evoluciones
          </div>
          <div style={{display:"flex",gap:"4px",marginBottom:"4px",fontSize:"10px"}}>
            <label><input type="checkbox" checked readOnly/> Médicas</label>
            <label><input type="checkbox" checked readOnly/> Enfermería</label>
            <label style={{marginLeft:"8px"}}>VerTodos</label>
          </div>
          <div style={{border:"2px inset #808080",background:"#fff"}}>
            <div style={{display:"grid",gridTemplateColumns:"100px 80px auto 1fr",background:"#e8e8e8",fontWeight:"bold",fontSize:"9px",borderBottom:"1px solid #808080"}}>
              {["Fecha","Hora","S","Evoluciones"].map(h=><div key={h} style={{padding:"3px 4px",borderRight:"1px solid #ccc"}}>{h}</div>)}
            </div>
            {project.registros.map((reg,i) => {
              const colors = ["#ffff80","#fff","#87ceeb","#ffff80","#fff"];
              return <div key={reg.id||i} onClick={()=>onSelectRegistro(i)}
                style={{display:"grid",gridTemplateColumns:"100px 80px auto 1fr",borderBottom:"1px solid #e0e0e0",cursor:"pointer",fontSize:"10px",background:colors[i%colors.length]||"#fff"}}
                onMouseEnter={e=>e.currentTarget.style.background="#ffffcc"}
                onMouseLeave={e=>e.currentTarget.style.background=colors[i%colors.length]||"#fff"}>
                <div style={{padding:"3px 4px",borderRight:"1px solid #e0e0e0"}}>{new Date().toLocaleDateString("es-AR")}</div>
                <div style={{padding:"3px 4px",borderRight:"1px solid #e0e0e0"}}>{new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}</div>
                <div style={{padding:"3px 4px",borderRight:"1px solid #e0e0e0",textAlign:"center"}}>
                  <div style={{width:"12px",height:"12px",background:"#4040ff",border:"1px solid #000",display:"inline-block"}}/>
                </div>
                <div style={{padding:"3px 4px",fontWeight:"bold"}}>
                  {reg.estudio||`Registro ${i+1}`}
                </div>
              </div>;
            })}
            {!project.registros.length&&<div style={{padding:"20px",textAlign:"center",color:"#808080"}}>Sin registros</div>}
          </div>
        </div>

        <div style={{marginTop:"8px",textAlign:"center",fontSize:"9px",color:"#808080",borderTop:"1px solid #808080",paddingTop:"4px"}}>
          Más de una versión
        </div>
      </div>
    </div>
  </div>;
}


// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [mode, setMode] = useState("loading");
  const [project, setProject] = useState(defaultProject());
  const [activeRegIdx, setActiveRegIdx] = useState(0);
  const [selectedRegIdx, setSelectedRegIdx] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [showColConfig, setShowColConfig] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verId = params.get("ver");
    const sheetParam = params.get("sheet");
    if (verId && sheetParam) {
      loadProject(sheetParam, verId);
    } else {
      setMode("editor");
    }
  }, []);

  const loadProject = async (sheetUrl, projectId) => {
    try {
      const url = `${sheetUrl}${sheetUrl.includes("?")?"&":"?"}id=${projectId}`;
      const resp = await fetch(url, {redirect:"follow"});
      const text = await resp.text();
      let data;
      try { data = JSON.parse(text); } catch {
        console.error("Invalid JSON response:", text);
        alert("Error: respuesta inválida del servidor.");
        setMode("error");
        return;
      }
      if (data.status === "ok" && data.project) {
        setProject({...defaultProject(), ...data.project, sheetUrl});
        if (data.project.registros && data.project.registros.length === 1) {
          setSelectedRegIdx(0);
          setMode("viewer_registro");
        } else {
          setMode("viewer_hce");
        }
      } else {
        alert(data.message || "No se pudo cargar. Verifique el link.");
        setMode("error");
      }
    } catch (err) {
      console.error("Load error:", err);
      alert("Error de conexión. Verifique que la URL del Sheet sea correcta.");
      setMode("error");
    }
  };

  const publishProject = async () => {
    if (!project.sheetUrl) {alert("⚠️ Pegá la URL del Google Sheet primero."); return;}
    if (!project.registros.length) {alert("⚠️ Armá al menos un registro."); return;}
    setPublishing(true);
    const projectId = "p" + Date.now();
    try {
      const payload = JSON.stringify({
        action:"save_project", projectId,
        paciente: project.registros.map(r=>r.estudio).join(", "),
        project,
      });
      // Apps Script POST: use text/plain to avoid CORS preflight
      const resp = await fetch(project.sheetUrl, {
        method:"POST",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body: payload,
        redirect:"follow",
      });
      const text = await resp.text();
      let result;
      try { result = JSON.parse(text); } catch { result = null; }
      if (result && result.status === "ok") {
        const baseUrl = window.location.origin + window.location.pathname;
        setPublishedUrl(`${baseUrl}?ver=${projectId}&sheet=${encodeURIComponent(project.sheetUrl)}`);
      } else {
        // Fallback: assume it worked (some Apps Script configs return opaque)
        const baseUrl = window.location.origin + window.location.pathname;
        setPublishedUrl(`${baseUrl}?ver=${projectId}&sheet=${encodeURIComponent(project.sheetUrl)}`);
        console.warn("Publish response:", text);
      }
    } catch (err) {
      // If CORS blocks reading response, try no-cors as fallback
      try {
        await fetch(project.sheetUrl, {
          method:"POST",
          body: JSON.stringify({
            action:"save_project", projectId,
            paciente: project.registros.map(r=>r.estudio).join(", "),
            project,
          }),
          mode:"no-cors",
        });
        const baseUrl = window.location.origin + window.location.pathname;
        setPublishedUrl(`${baseUrl}?ver=${projectId}&sheet=${encodeURIComponent(project.sheetUrl)}`);
      } catch { alert("❌ Error al publicar."); }
    }
    setPublishing(false);
  };

  const updRegistro = (idx, nr) => setProject(p=>{const r=[...p.registros];r[idx]=nr;return{...p,registros:r};});
  const addRegistro = () => {setProject(p=>({...p,registros:[...p.registros,defaultRegistro()]}));setActiveRegIdx(project.registros.length);};
  const removeRegistro = idx => {setProject(p=>({...p,registros:p.registros.filter((_,i)=>i!==idx)}));if(activeRegIdx>=idx&&activeRegIdx>0)setActiveRegIdx(activeRegIdx-1);};

  const exportProject = () => {const b=new Blob([JSON.stringify(project,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="registros.json";a.click();};
  const importProject = () => {const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.registros){setProject({...defaultProject(),...d});alert("✅ OK");}else alert("❌ Formato inválido");}catch{alert("❌ Error");}};r.readAsText(f);};input.click();};

  // === LOADING ===
  if (mode === "loading") return <div style={{fontFamily:F,background:"#c0c0c0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0",padding:"40px",textAlign:"center"}}>
      <div style={{fontSize:"14px",fontWeight:"bold",color:"#000080"}}>⏳ Cargando...</div>
    </div>
  </div>;

  if (mode === "error") return <div style={{fontFamily:F,background:"#c0c0c0",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0",padding:"40px",textAlign:"center"}}>
      <div style={{fontSize:"14px",fontWeight:"bold",color:"#800000"}}>❌ Error al cargar el proyecto</div>
      <div style={{fontSize:"11px",marginTop:"8px"}}>Verifique que el link sea correcto.</div>
    </div>
  </div>;

  // === VIEWER (user) ===
  if (mode === "viewer_hce") return <SisghHCEPortal project={project} onSelectRegistro={idx=>{setSelectedRegIdx(idx);setMode("viewer_registro");}}/>;
  if (mode === "viewer_registro") return <SisghRegistroView registro={project.registros[selectedRegIdx]} sheetUrl={project.sheetUrl}
    colWidths={project.colWidths} onBack={project.registros.length>1?()=>setMode("viewer_hce"):null}/>;

  // === EDITOR PREVIEW ===
  if (mode === "preview_hce") return <SisghHCEPortal project={project} onSelectRegistro={idx=>{setSelectedRegIdx(idx);setMode("preview_registro");}}/>;
  if (mode === "preview_registro") return <SisghRegistroView registro={project.registros[selectedRegIdx]} sheetUrl={project.sheetUrl}
    colWidths={project.colWidths} onBack={()=>setMode(project.registros.length>1?"preview_hce":"editor")}/>;

  // === EDITOR ===
  return <div style={{fontFamily:F,fontSize:"11px",background:"#c0c0c0",minHeight:"100vh",padding:"6px"}}>
    <div style={{display:"flex",gap:"4px",marginBottom:"6px",alignItems:"center",padding:"4px",border:"2px groove #c0c0c0",flexWrap:"wrap"}}>
      <b style={{fontSize:"12px",color:"#000080"}}>SISGH Mockup Builder</b>
      <div style={{width:"2px",height:"20px",borderLeft:"1px solid #808080",borderRight:"1px solid #fff",margin:"0 4px"}}/>
      <VBtn onClick={()=>setMode(project.registros.length>1?"preview_hce":"preview_registro")} style={{background:"#d0ffd0"}}>👁️ Preview</VBtn>
      <VBtn onClick={publishProject} disabled={publishing} style={{background:"#ffd0d0",fontWeight:"bold"}}>{publishing?"⏳...":"🚀 Publicar"}</VBtn>
      <div style={{width:"2px",height:"20px",borderLeft:"1px solid #808080",borderRight:"1px solid #fff",margin:"0 4px"}}/>
      <VBtn onClick={exportProject} small>📤</VBtn>
      <VBtn onClick={importProject} small>📥</VBtn>
      <div style={{flex:1}}/>
      <VBtn onClick={()=>{if(window.confirm("¿Nuevo?"))setProject(defaultProject());setPublishedUrl("");}} small style={{color:"#800000"}}>🔄</VBtn>
    </div>

    {publishedUrl&&<div style={{background:"#e8ffe8",border:"2px solid #00aa00",padding:"8px",marginBottom:"6px"}}>
      <b style={{color:"#006600"}}>✅ Link para el usuario:</b>
      <div style={{display:"flex",gap:"4px",marginTop:"4px",alignItems:"center"}}>
        <input type="text" value={publishedUrl} readOnly style={{flex:1,fontFamily:"Consolas,monospace",fontSize:"10px",border:"2px inset #808080",padding:"3px"}} onClick={e=>e.target.select()}/>
        <VBtn onClick={()=>{navigator.clipboard.writeText(publishedUrl);alert("✅ Copiado!");}} small>📋</VBtn>
      </div>
      <div style={{fontSize:"9px",color:"#666",marginTop:"4px"}}>El usuario ve SISGH idéntico + modo revisión. Vos recibís en el Sheet.</div>
    </div>}

    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0",marginBottom:"6px"}}>
      <div style={{background:"#444",color:"#fff",fontWeight:"bold",padding:"3px 6px",fontSize:"10px"}}>⚙️ Google Sheet URL</div>
      <div style={{padding:"6px 8px",display:"flex",gap:"8px",alignItems:"center"}}>
        <VInp value={project.sheetUrl} onChange={e=>setProject(p=>({...p,sheetUrl:e.target.value}))} placeholder="https://script.google.com/macros/s/XXXX/exec" style={{flex:1}}/>
      </div>
    </div>

    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0",marginBottom:"6px"}}>
      <div style={{background:"#444",color:"#fff",fontWeight:"bold",padding:"3px 6px",fontSize:"10px",cursor:"pointer",display:"flex",justifyContent:"space-between"}}
        onClick={()=>setShowColConfig(!showColConfig)}>
        <span>📐 Anchos de Columna (Preview/Usuario)</span><span style={{fontSize:"9px"}}>{showColConfig?"▼":"▶"}</span>
      </div>
      {showColConfig&&<div style={{padding:"6px 8px",display:"flex",gap:"12px",alignItems:"center",flexWrap:"wrap",fontSize:"10px",fontFamily:F}}>
        {[["titulo","Título"],["item","Item"],["resultado","Resultado"]].map(([k,label])=>
          <div key={k} style={{display:"flex",alignItems:"center",gap:"4px"}}>
            <b>{label}:</b>
            <input type="number" value={project.colWidths?.[k]||0} onChange={e=>setProject(p=>({...p,colWidths:{...p.colWidths,[k]:parseInt(e.target.value)||0}}))}
              style={{width:"55px",fontFamily:F,fontSize:"10px",border:"2px inset #808080",padding:"1px 3px",textAlign:"right"}} min="60" max="500"/>
            <span style={{color:"#666"}}>px</span>
          </div>)}
        <span style={{fontSize:"9px",color:"#666"}}>(SubItem se ajusta automáticamente)</span>
      </div>}
    </div>

    <div style={{border:"2px outset #dfdfdf",background:"#c0c0c0"}}>
      <div style={{background:"linear-gradient(90deg,#000080,#1084d0)",color:"#fff",fontWeight:"bold",padding:"3px 6px",display:"flex",justifyContent:"space-between"}}>
        <span>📝 Registros ({project.registros.length})</span>
        <VBtn onClick={addRegistro} small style={{fontSize:"9px"}}>➕ Nuevo</VBtn>
      </div>
      <div style={{padding:"4px 8px"}}>
        <div style={{display:"flex",gap:"2px",marginBottom:"6px",flexWrap:"wrap"}}>
          {project.registros.map((reg,i)=><div key={reg.id||i} style={{display:"flex",alignItems:"center"}}>
            <VBtn active={activeRegIdx===i} onClick={()=>setActiveRegIdx(i)} small>{reg.estudio||`Reg ${i+1}`}</VBtn>
            {project.registros.length>1&&<span onClick={()=>{if(window.confirm("¿Eliminar?"))removeRegistro(i);}} style={{cursor:"pointer",fontSize:"9px",color:"#800000",padding:"0 3px"}}>✕</span>}
          </div>)}
        </div>
        {project.registros[activeRegIdx]&&<RegistroEditor registro={project.registros[activeRegIdx]} setRegistro={nr=>updRegistro(activeRegIdx,nr)}/>}
      </div>
    </div>
  </div>;
}
