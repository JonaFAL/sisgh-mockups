import { useState, useEffect } from "react";

// === DATA ===
const TIPOS_DATO = [
  { code:"A",label:"Buleano (Normal/Patológico)",group:"buleano" },
  { code:"B",label:"Buleano (Verdadero/Falso)",group:"buleano" },
  { code:"C",label:"Combo de Opciones",group:"combo" },
  { code:"D",label:"Diagnóstico",group:"simple" },
  { code:"E",label:"Edad (del Paciente)",group:"simple" },
  { code:"F",label:"Fecha",group:"simple" },
  { code:"G",label:"Score Comorbilidad (ACE27)",group:"simple" },
  { code:"H",label:"Hora",group:"simple" },
  { code:"I",label:"Imagen",group:"simple" },
  { code:"J",label:"Signos Vitales",group:"simple" },
  { code:"K",label:"Servicio - Recurso Médico",group:"simple" },
  { code:"L",label:"Laboratorio",group:"simple" },
  { code:"M",label:"Diag. x Imágenes",group:"simple" },
  { code:"N",label:"Numérico",group:"numerico" },
  { code:"O",label:"Estudios Complementarios",group:"simple" },
  { code:"P",label:"Práctica Nomenclada",group:"simple" },
  { code:"Q",label:"Antecedentes",group:"simple" },
  { code:"R",label:"Recurso Médico",group:"simple" },
  { code:"S",label:"Sexo",group:"simple" },
  { code:"T",label:"Texto (con/sin plantilla)",group:"texto" },
  { code:"U",label:"Conclusión (Epicrisis)",group:"texto" },
  { code:"V",label:"Datos Solicitud de OT",group:"simple" },
  { code:"X",label:"Código Sexo (1 Masc/2 Fem)",group:"simple" },
];
const CATEGORIAS=["Evolución Enfermería","Evolución Médica","Informe Médico","Dato Complementario","Informe Complementario"];
const ESPECIALIDADES=["INFECTOLOGIA","CLINICA MEDICA","CIRUGIA","KINESIOLOGIA","ENFERMERIA","CARDIOLOGIA","NUTRICION","PSICOLOGIA","TRAUMATOLOGIA","NEUMONOLOGIA"];

const emptyRow=()=>({id:Date.now()+Math.random(),titulo:"",item:"",subitem:"",tipoDato:"T",obligatorio:false,imprime:true,porDefecto:false,traeUltimoValor:false,decimales:false,positivo:"Normal",negativo:"Patológico",rangoMin:"",rangoMax:"",opciones:["","","","","",""],plantilla:"",soloUna:false,clave:false,unidad:"",rangoMinN:"",rangoMaxN:""});
const defaultForm=()=>({id:Date.now()+Math.random(),estudio:"",titulo:"",especialidad:"INFECTOLOGIA",categoria:"Evolución Enfermería",rows:[emptyRow()]});
const defaultProject=()=>({paciente:{nombre:"",hc:"",edad:"",sexo:"Fem",fechaNacimiento:""},internacion:{episodio:"",ingreso:"",ubicacion:"",egreso:"",cantDias:""},formularios:[defaultForm()],sheetUrl:""});

const S={bg:"#c0c0c0",bgDark:"#a0a0a0",borderLight:"#dfdfdf",borderDark:"#808080",blue:"#000080",blueGrad:"linear-gradient(90deg,#000080,#1084d0)",white:"#fff",yellow:"#ffff80",pink:"#ffcccc",teal:"#008080",font:'"MS Sans Serif","Microsoft Sans Serif",Tahoma,Arial,sans-serif',gridHeader:"#0000a8"};

// === VFP COMPONENTS ===
const VBtn=({children,onClick,style,active,disabled,small})=>(<button onClick={onClick} disabled={disabled} style={{fontFamily:S.font,fontSize:small?"10px":"11px",padding:small?"2px 8px":"3px 12px",border:active?`2px inset ${S.borderDark}`:`2px outset ${S.borderLight}`,background:active?S.bgDark:S.bg,cursor:disabled?"default":"pointer",color:disabled?"#808080":"#000",whiteSpace:"nowrap",...style}}>{children}</button>);
const VInp=({value,onChange,style,placeholder})=>(<input value={value} onChange={onChange} placeholder={placeholder} style={{fontFamily:S.font,fontSize:"11px",border:`2px inset ${S.borderDark}`,padding:"2px 4px",background:"#fff",...style}}/>);
const VSel=({value,onChange,options,style})=>(<select value={value} onChange={onChange} style={{fontFamily:S.font,fontSize:"11px",border:`2px inset ${S.borderDark}`,padding:"1px 2px",background:"#fff",...style}}>{options.map(o=>(<option key={typeof o==="string"?o:o.value} value={typeof o==="string"?o:o.value}>{typeof o==="string"?o:o.label}</option>))}</select>);
const VChk=({checked,onChange,label})=>(<label style={{fontFamily:S.font,fontSize:"10px",display:"flex",alignItems:"center",gap:"3px",cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={checked} onChange={onChange}/>{label}</label>);
const Sep=()=>(<div style={{width:"2px",height:"20px",borderLeft:`1px solid ${S.borderDark}`,borderRight:"1px solid #fff",margin:"0 4px"}}/>);

// === TIPO CONFIG ===
function TipoConfig({row,onChange}){
  const tipo=TIPOS_DATO.find(t=>t.code===row.tipoDato);if(!tipo)return null;
  const upd=(f,v)=>onChange({...row,[f]:v});
  const updOpc=(i,v)=>{const o=[...row.opciones];o[i]=v;onChange({...row,opciones:o});};
  const box={background:"#f0f0e8",border:`1px solid ${S.borderDark}`,padding:"8px 10px",marginTop:"4px",fontFamily:S.font,fontSize:"10px"};
  const mi={fontFamily:S.font,fontSize:"10px",border:`1px inset ${S.borderDark}`,padding:"2px 4px",background:"#fff"};
  if(tipo.group==="buleano")return(<div style={box}><div style={{fontWeight:"bold",marginBottom:"6px",color:S.blue}}>🔘 Buleano</div><div style={{display:"flex",gap:"16px",flexWrap:"wrap"}}><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Positivo</div><input value={row.positivo} onChange={e=>upd("positivo",e.target.value)} style={{...mi,width:"100px"}}/></div><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Negativo</div><input value={row.negativo} onChange={e=>upd("negativo",e.target.value)} style={{...mi,width:"100px"}}/></div><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Rango Mín</div><input value={row.rangoMin} onChange={e=>upd("rangoMin",e.target.value)} style={{...mi,width:"70px"}}/></div><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Rango Máx</div><input value={row.rangoMax} onChange={e=>upd("rangoMax",e.target.value)} style={{...mi,width:"70px"}}/></div></div></div>);
  if(tipo.group==="combo")return(<div style={box}><div style={{fontWeight:"bold",marginBottom:"6px",color:S.blue}}>📋 Opciones del Combo</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"6px"}}>{row.opciones.map((op,i)=>(<div key={i}><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Opción {i+1}</div><input value={op} onChange={e=>updOpc(i,e.target.value)} style={{...mi,width:"100%"}} placeholder={`Opción ${i+1}...`}/></div>))}</div></div>);
  if(tipo.group==="texto")return(<div style={box}><div style={{fontWeight:"bold",marginBottom:"6px",color:S.blue}}>📝 Texto</div><div style={{display:"flex",gap:"16px",alignItems:"start",flexWrap:"wrap"}}><div style={{flex:1,minWidth:"200px"}}><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Plantilla</div><textarea value={row.plantilla} onChange={e=>upd("plantilla",e.target.value)} rows={2} style={{...mi,width:"100%",resize:"vertical"}} placeholder="Texto predeterminado..."/></div><div style={{display:"flex",flexDirection:"column",gap:"4px",paddingTop:"14px"}}><VChk checked={row.soloUna} onChange={e=>upd("soloUna",e.target.checked)} label="Solo Una"/><VChk checked={row.clave} onChange={e=>upd("clave",e.target.checked)} label="Clave"/></div></div></div>);
  if(tipo.group==="numerico")return(<div style={box}><div style={{fontWeight:"bold",marginBottom:"6px",color:S.blue}}>🔢 Numérico</div><div style={{display:"flex",gap:"16px",flexWrap:"wrap",alignItems:"end"}}><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Unidad</div><input value={row.unidad} onChange={e=>upd("unidad",e.target.value)} style={{...mi,width:"80px"}} placeholder="mg/dl"/></div><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Mín</div><input value={row.rangoMinN} onChange={e=>upd("rangoMinN",e.target.value)} style={{...mi,width:"70px"}}/></div><div><div style={{fontSize:"9px",color:"#444",marginBottom:"2px"}}>Máx</div><input value={row.rangoMaxN} onChange={e=>upd("rangoMaxN",e.target.value)} style={{...mi,width:"70px"}}/></div><VChk checked={row.decimales} onChange={e=>upd("decimales",e.target.checked)} label="Decimales"/></div></div>);
  return(<div style={{...box,background:"#f8f8f0"}}><span style={{color:"#666"}}>ℹ️ {tipo.code} - {tipo.label}: sin config adicional.</span></div>);
}

// === IMPORT MODAL ===
function ImportModal({onClose,onImport}){
  const[text,setText]=useState("");const[sep,setSep]=useState("tab");
  const parse=(raw,s)=>{const d=s==="tab"?"\t":s==="semicolon"?";":","
    return raw.trim().split("\n").filter(l=>l.trim()).map(line=>{const c=line.split(d).map(x=>x.trim());const tc=(c[3]||"T").toUpperCase();const vt=TIPOS_DATO.find(t=>t.code===tc);return{titulo:c[0]||"",item:c[1]||"",subitem:c[2]||"",tipoDato:vt?vt.code:"T",obligatorio:["S","SI","TRUE"].includes((c[4]||"").toUpperCase())};});};
  const preview=text?parse(text,sep):[];
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.4)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:S.bg,border:`2px outset ${S.borderLight}`,width:"680px",maxWidth:"95vw",maxHeight:"90vh",display:"flex",flexDirection:"column",fontFamily:S.font,fontSize:"11px"}}>
    <div style={{background:S.blueGrad,color:S.white,fontWeight:"bold",padding:"3px 6px"}}>📋 Importar desde Excel</div>
    <div style={{padding:"10px",overflow:"auto",flex:1}}>
      <div style={{background:"#ffffcc",border:"1px solid #cc9900",padding:"6px",marginBottom:"8px",fontSize:"10px",lineHeight:1.4}}>Columnas: <b>Título | Item | SubItem | TipoDato (letra) | Obligatorio (S/N)</b></div>
      <div style={{display:"flex",gap:"12px",marginBottom:"6px"}}>{[["tab","Tab (Excel)"],["semicolon",";"],["comma",","]].map(([v,l])=>(<label key={v} style={{display:"flex",alignItems:"center",gap:"3px",fontSize:"10px",cursor:"pointer"}}><input type="radio" checked={sep===v} onChange={()=>setSep(v)}/>{l}</label>))}</div>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Pegá acá las filas..." style={{width:"100%",height:"100px",fontFamily:"Consolas,monospace",fontSize:"10px",border:`2px inset ${S.borderDark}`,padding:"4px",resize:"vertical"}}/>
      {preview.length>0&&<div style={{marginTop:"8px"}}><b style={{color:S.blue}}>{preview.length} filas</b><div style={{border:`2px inset ${S.borderDark}`,background:"#fff",marginTop:"4px",maxHeight:"150px",overflowY:"auto",fontSize:"10px"}}>{preview.map((r,i)=>(<div key={i} style={{display:"flex",gap:"8px",padding:"2px 4px",borderBottom:"1px solid #eee"}}><span style={{color:"#800000",fontWeight:"bold",width:"20px"}}>{i+1}</span><span style={{flex:1,fontWeight:"bold"}}>{r.titulo||"—"}</span><span style={{flex:1}}>{r.item||"—"}</span><span style={{width:"60px"}}><span style={{background:"#e0e0ff",padding:"0 3px",fontSize:"9px"}}>{r.tipoDato}</span></span></div>))}</div></div>}
    </div>
    <div style={{display:"flex",gap:"6px",justifyContent:"flex-end",padding:"8px",borderTop:`1px solid ${S.borderDark}`}}><VBtn onClick={onClose} small>Cancelar</VBtn><VBtn disabled={!preview.length} onClick={()=>{onImport(preview);onClose();}} small style={{background:"#d0d0ff",fontWeight:"bold"}}>✅ Importar {preview.length}</VBtn></div>
  </div></div>);
}

// === FORM EDITOR ===
function FormEditor({form,setForm}){
  const[expRow,setExpRow]=useState(null);const[showImport,setShowImport]=useState(false);
  const upd=(f,v)=>setForm({...form,[f]:v});
  const updRow=(i,f,v)=>{const r=[...form.rows];r[i]={...r[i],[f]:v};setForm({...form,rows:r});};
  const updRowFull=(i,nr)=>{const r=[...form.rows];r[i]=nr;setForm({...form,rows:r});};
  const addRow=()=>{setForm({...form,rows:[...form.rows,emptyRow()]});setExpRow(form.rows.length);};
  const removeRow=i=>{setForm({...form,rows:form.rows.filter((_,j)=>j!==i)});if(expRow===i)setExpRow(null);};
  const moveRow=(i,d)=>{const r=[...form.rows];const n=i+d;if(n<0||n>=r.length)return;[r[i],r[n]]=[r[n],r[i]];setForm({...form,rows:r});if(expRow===i)setExpRow(n);};
  const dupRow=i=>{const r=[...form.rows];r.splice(i+1,0,{...r[i],id:Date.now()+Math.random()});setForm({...form,rows:r});setExpRow(i+1);};

  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 1fr",gap:"4px 8px",alignItems:"center",marginBottom:"6px"}}><b>Estudio</b><VInp value={form.estudio} onChange={e=>upd("estudio",e.target.value)} placeholder="AISLAMIENTO - RESPIRATORIO AÉREO" style={{width:"100%"}}/><b>Categoría</b><VSel value={form.categoria} onChange={e=>upd("categoria",e.target.value)} options={CATEGORIAS}/></div>
    <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 1fr",gap:"4px 8px",alignItems:"center",marginBottom:"6px"}}><b>Título</b><VInp value={form.titulo} onChange={e=>upd("titulo",e.target.value)} placeholder="COMITE DE CONTROL DE INFECCIONES" style={{width:"100%"}}/><b>Especialidad</b><VSel value={form.especialidad} onChange={e=>upd("especialidad",e.target.value)} options={ESPECIALIDADES}/></div>
    <div style={{display:"flex",gap:"4px",marginBottom:"4px",flexWrap:"wrap"}}><VBtn onClick={addRow} small>➕ Fila</VBtn><VBtn onClick={()=>setShowImport(true)} small style={{background:"#e8ffe8"}}>📋 Importar Excel</VBtn><div style={{flex:1}}/><span style={{fontSize:"10px",color:"#666"}}>{form.rows.length} filas</span></div>
    <div style={{border:`2px groove ${S.bg}`,background:"#fff",marginBottom:"6px"}}>
      <div style={{display:"grid",gridTemplateColumns:"26px 28px 26px 1fr 1fr 1fr 150px 34px",background:S.gridHeader,color:"#fff",fontSize:"9px",fontWeight:"bold"}}>{["","#","","Título","Item","SubItem","Tipo de Dato","Obl."].map((h,i)=>(<div key={i} style={{padding:"3px 2px",borderRight:"1px solid #4040c0",textAlign:"center"}}>{h}</div>))}</div>
      <div style={{maxHeight:"300px",overflowY:"auto"}}>
        {form.rows.map((row,idx)=>{const isExp=expRow===idx;const ti=TIPOS_DATO.find(t=>t.code===row.tipoDato);return(<div key={row.id}>
          <div style={{display:"grid",gridTemplateColumns:"26px 28px 26px 1fr 1fr 1fr 150px 34px",borderBottom:`1px solid ${isExp?S.blue:"#e0e0e0"}`,minHeight:"26px",fontSize:"10px",background:isExp?"#e0e0ff":idx%2?"#f8f8f8":"#fff"}}>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",borderRight:"1px solid #e0e0e0"}}><span onClick={()=>moveRow(idx,-1)} style={{cursor:"pointer",fontSize:"8px"}}>▲</span><span onClick={()=>moveRow(idx,1)} style={{cursor:"pointer",fontSize:"8px"}}>▼</span></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0",color:"#800000",fontWeight:"bold"}}>{idx+1}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0"}}><span onClick={()=>setExpRow(isExp?null:idx)} style={{cursor:"pointer",fontSize:"11px",fontWeight:"bold",color:S.blue,transform:isExp?"rotate(90deg)":"none",display:"inline-block",transition:"transform 0.15s"}}>▶</span></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px"}}><input value={row.titulo} onChange={e=>updRow(idx,"titulo",e.target.value)} style={{width:"100%",border:"none",fontSize:"10px",fontFamily:S.font,background:"transparent",padding:"2px"}} placeholder="Título..."/></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px"}}><input value={row.item} onChange={e=>updRow(idx,"item",e.target.value)} style={{width:"100%",border:"none",fontSize:"10px",fontFamily:S.font,background:"transparent",padding:"2px"}} placeholder="Item..."/></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px"}}><input value={row.subitem} onChange={e=>updRow(idx,"subitem",e.target.value)} style={{width:"100%",border:"none",fontSize:"9px",fontFamily:S.font,background:"transparent",padding:"2px"}} placeholder="SubItem..."/></div>
            <div style={{borderRight:"1px solid #e0e0e0",padding:"1px 2px",display:"flex",alignItems:"center"}}><select value={row.tipoDato} onChange={e=>{updRow(idx,"tipoDato",e.target.value);setExpRow(idx);}} style={{width:"100%",fontSize:"9px",fontFamily:S.font,border:"1px solid #999",padding:"1px"}}>{TIPOS_DATO.map(t=>(<option key={t.code} value={t.code}>{t.code} - {t.label}</option>))}</select></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}><input type="checkbox" checked={row.obligatorio} onChange={e=>updRow(idx,"obligatorio",e.target.checked)}/></div>
          </div>
          {isExp&&<div style={{background:"#f0f0f8",borderBottom:`2px solid ${S.blue}`,padding:"8px 10px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}><span style={{fontWeight:"bold",fontSize:"11px",color:S.blue}}>⚙️ {ti?.code} - {ti?.label}</span><div style={{display:"flex",gap:"3px"}}><VBtn small onClick={()=>dupRow(idx)}>📋</VBtn><VBtn small onClick={()=>removeRow(idx)} style={{color:"#800000"}}>🗑️</VBtn></div></div>
            <TipoConfig row={row} onChange={nr=>updRowFull(idx,nr)}/>
          </div>}
        </div>);})}
        {!form.rows.length&&<div style={{padding:"20px",textAlign:"center",color:"#808080"}}>Sin filas</div>}
      </div>
    </div>
    {showImport&&<ImportModal onClose={()=>setShowImport(false)} onImport={imported=>{setForm({...form,rows:[...form.rows,...imported.map(r=>({...emptyRow(),...r,id:Date.now()+Math.random()}))]});}}/>}
  </div>);
}

// === REGISTRO VIEW (user reviews) ===
function RegistroView({form,sheetUrl,onBack,paciente}){
  const[commentMode,setCommentMode]=useState(false);
  const[comments,setComments]=useState({});
  const[popup,setPopup]=useState(null);
  const[popupType,setPopupType]=useState("corregir");
  const[popupText,setPopupText]=useState("");
  const[showSend,setShowSend]=useState(false);
  const[sender,setSender]=useState("");
  const[nota,setNota]=useState("");
  const[sending,setSending]=useState(false);
  const cc=Object.keys(comments).length;

  const openPopup=(field,e)=>{if(!commentMode)return;e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();setPopup({field,x:Math.min(r.left,window.innerWidth-340),y:Math.min(r.bottom+4,window.innerHeight-220)});setPopupType(comments[field]?.type||"corregir");setPopupText(comments[field]?.text||"");};
  const saveComment=()=>{if(!popupText.trim())return;setComments(c=>({...c,[popup.field]:{type:popupType,text:popupText.trim()}}));setPopup(null);};
  const removeComment=()=>{setComments(c=>{const n={...c};delete n[popup.field];return n;});setPopup(null);};

  const sendToSheet=async()=>{
    if(!sheetUrl){alert("⚠️ No hay URL de Google Sheet configurada.");return;}
    setSending(true);
    try{
      const payload={action:"comment",revisor:sender||"(anónimo)",estudio:form.estudio||"(sin estudio)",notaGeneral:nota,comments:Object.entries(comments).map(([campo,d])=>({campo,tipo:d.type,texto:d.text}))};
      await fetch(sheetUrl,{method:"POST",body:JSON.stringify(payload),mode:"no-cors"});
      alert("✅ ¡Comentarios enviados! Gracias por tu revisión.");
      setComments({});setShowSend(false);
    }catch{alert("❌ Error al enviar. Intentá de nuevo.");}
    setSending(false);
  };

  const renderResultado=row=>{
    const tipo=TIPOS_DATO.find(t=>t.code===row.tipoDato);if(!tipo)return<span style={{color:"#999"}}>[?]</span>;
    if(tipo.group==="buleano")return(<div style={{display:"flex",gap:"6px",alignItems:"center",fontSize:"10px"}}><label style={{display:"flex",alignItems:"center",gap:"2px"}}><input type="radio" disabled/>{row.positivo}</label><label style={{display:"flex",alignItems:"center",gap:"2px"}}><input type="radio" disabled/>{row.negativo}</label></div>);
    if(tipo.group==="combo"){const opts=row.opciones.filter(o=>o.trim());return opts.length?<select disabled style={{fontFamily:S.font,fontSize:"10px",border:`1px inset ${S.borderDark}`,width:"100%",background:"#fff"}}><option>Seleccionar...</option>{opts.map((o,i)=><option key={i}>{o}</option>)}</select>:<span style={{color:"#999",fontSize:"9px"}}>[Combo vacío]</span>;}
    if(tipo.group==="texto")return<div style={{border:`1px inset ${S.borderDark}`,background:"#fff",padding:"1px 3px",minHeight:"16px",color:"#999",fontSize:"9px"}}>{row.plantilla||"[Texto libre]"}</div>;
    if(tipo.group==="numerico")return(<div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"10px"}}><div style={{border:`1px inset ${S.borderDark}`,background:"#fff",padding:"1px 3px",width:"50px",textAlign:"right",color:"#999"}}>0{row.decimales?".00":""}</div>{row.unidad&&<span style={{fontSize:"9px",color:"#444"}}>{row.unidad}</span>}</div>);
    const icons={D:"🔍 Diagnóstico",E:"📅 Edad",F:"📅 Fecha",H:"🕐 Hora",I:"📷 Imagen",J:"❤️ Signos",K:"🏥 Servicio",L:"🔬 Lab",M:"📊 Dx.Img",O:"📋 Est.Comp",P:"📝 Práctica",Q:"📜 Antec.",R:"👨‍⚕️ Rec.Méd",S:"⚥ Sexo",U:"📄 Epicrisis",V:"📑 OT",X:"⚥ 1/2",G:"📊 ACE27"};
    return<span style={{color:"#666",fontSize:"9px"}}>{icons[tipo.code]||`[${tipo.code}]`}</span>;
  };

  const Cell=({field,children,style})=>(<div onClick={e=>openPopup(field,e)} style={{...style,position:"relative",cursor:commentMode?"pointer":"default",outline:comments[field]?"2px solid #ff4400":"none"}} onMouseEnter={e=>{if(commentMode)e.currentTarget.style.outline="2px solid #ff8800";}} onMouseLeave={e=>{e.currentTarget.style.outline=comments[field]?"2px solid #ff4400":"none";}}>{children}{comments[field]&&<span style={{position:"absolute",top:0,right:2,fontSize:"10px"}}>💬</span>}</div>);
  const tc={corregir:{bg:"#ffcccc",c:"#800000"},sugerir:{bg:"#ccccff",c:"#000080"},consulta:{bg:"#ccffcc",c:"#008000"},agregar:{bg:"#ffe0cc",c:"#804000"}};

  return(<div>
    <div style={{display:"flex",gap:"4px",padding:"4px",border:`2px groove ${S.bg}`,background:S.bg,alignItems:"center",fontFamily:S.font,marginBottom:"4px",flexWrap:"wrap"}}>
      <VBtn onClick={onBack} small>← Volver</VBtn><Sep/>
      <VBtn active={commentMode} onClick={()=>setCommentMode(!commentMode)}>{commentMode?"✅ Revisión ACTIVA":"📝 Modo Revisión"}</VBtn><Sep/>
      <VBtn onClick={()=>setShowSend(true)} disabled={cc===0} small>📧 Enviar ({cc})</VBtn>
      <VBtn onClick={()=>{if(window.confirm("¿Borrar?"))setComments({});}} disabled={cc===0} small>🗑️</VBtn>
      <div style={{flex:1}}/><span style={{fontSize:"10px",color:S.blue,fontWeight:"bold"}}>{cc} comentario{cc!==1?"s":""}</span>
    </div>
    {commentMode&&<div style={{background:"#ffffcc",border:"2px solid #ff8800",padding:"6px 12px",marginBottom:"6px",fontSize:"11px",fontWeight:"bold",color:"#884400",fontFamily:S.font}}>📝 MODO REVISIÓN — Clic en cualquier celda para comentar</div>}
    <div style={{border:`2px outset ${S.borderLight}`,background:S.bg,fontFamily:S.font}}>
      <div style={{background:S.blueGrad,color:S.white,fontWeight:"bold",fontSize:"11px",padding:"3px 6px"}}>{form.estudio||"ESTUDIO"} — {form.categoria}</div>
      <div style={{padding:"6px 8px",fontSize:"11px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",border:`1px solid ${S.borderDark}`,marginBottom:"4px"}}>
          <div style={{padding:"4px 8px",borderRight:`1px solid ${S.borderDark}`}}><div style={{color:S.teal,fontSize:"9px"}}>Paciente</div><div style={{fontSize:"18px",fontWeight:"bold"}}>{paciente.nombre||"[Nombre]"}</div><div style={{display:"flex",gap:"8px",marginTop:"2px",fontSize:"10px"}}><span><span style={{color:S.teal}}>HC:</span> <b>{paciente.hc||"—"}</b></span><span><span style={{color:S.teal}}>Edad:</span> <b>{paciente.edad||"—"}</b></span><span><span style={{color:S.teal}}>Sexo:</span> <b>{paciente.sexo||"—"}</b></span></div></div>
          <div style={{padding:"4px 8px",borderRight:`1px solid ${S.borderDark}`}}><div style={{color:S.teal,fontSize:"9px"}}>Orden</div><b>[Nº Orden]</b></div>
          <div style={{padding:"4px 8px"}}><div style={{color:S.teal,fontSize:"9px"}}>Fecha:</div><b style={{color:"#ff0000",fontSize:"12px"}}>{new Date().toLocaleString("es-AR")}</b></div>
        </div>
        <div style={{border:`2px inset ${S.borderDark}`,background:"#fff"}}>
          <div style={{display:"grid",gridTemplateColumns:"140px 170px 1fr 24px 24px 200px",background:S.gridHeader,color:"#fff",fontWeight:"bold",fontSize:"10px"}}>{["Título","Item","SubItem","P","R","Resultado"].map(h=>(<div key={h} style={{padding:"3px 4px",borderRight:"1px solid #4040c0",textAlign:"center"}}>{h}</div>))}</div>
          <div style={{minHeight:"120px"}}>{form.rows.map((row,idx)=>{const fp=`Fila ${idx+1}: ${row.titulo||"(sin título)"}`;return(<div key={row.id} style={{display:"grid",gridTemplateColumns:"140px 170px 1fr 24px 24px 200px",borderBottom:"1px solid #c0c0c0",minHeight:"28px",fontSize:"10px"}}>
            <Cell field={`${fp} > Título`} style={{padding:"2px 4px",borderRight:"1px solid #e0e0e0",background:S.yellow,fontWeight:"bold"}}>{row.titulo||"—"}</Cell>
            <Cell field={`${fp} > Item`} style={{padding:"2px 4px",borderRight:"1px solid #e0e0e0",background:S.yellow}}>{row.item||"—"}</Cell>
            <Cell field={`${fp} > SubItem`} style={{padding:"2px 4px",borderRight:"1px solid #e0e0e0",background:S.yellow,fontSize:"9px",lineHeight:1.3}}>{row.subitem||"—"}</Cell>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0",background:S.yellow}}><div style={{width:"12px",height:"12px",background:"#fff",border:`1px inset ${S.borderDark}`,fontSize:"7px",display:"flex",alignItems:"center",justifyContent:"center"}}>▼</div></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",borderRight:"1px solid #e0e0e0",background:S.yellow}}><div style={{width:"12px",height:"12px",background:"#fff",border:`1px inset ${S.borderDark}`,fontSize:"7px",display:"flex",alignItems:"center",justifyContent:"center"}}>□</div></div>
            <Cell field={`${fp} > Resultado`} style={{padding:"2px 4px",background:S.pink}}>{renderResultado(row)}</Cell>
          </div>);})}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"3px 4px",border:`2px inset ${S.borderDark}`,marginTop:"4px",fontSize:"9px"}}><span>{[["#0a0","Obligatorio"],["#cc0","Incompleto"],["#f00","Fuera Rango"]].map(([c,l])=><span key={l} style={{marginRight:"6px"}}><span style={{width:"7px",height:"7px",borderRadius:"50%",background:c,display:"inline-block",marginRight:"2px"}}/>{l}</span>)}</span><span>[F2] Plantillas</span></div>
      </div>
    </div>

    {popup&&<div style={{position:"fixed",left:popup.x,top:popup.y,zIndex:1000,background:"#ffffee",border:`2px outset ${S.borderLight}`,padding:"8px",boxShadow:"3px 3px 6px rgba(0,0,0,0.3)",width:"320px",fontFamily:S.font,fontSize:"11px"}}>
      <div style={{fontWeight:"bold",fontSize:"10px",color:S.blue,marginBottom:"4px"}}>{popup.field}</div>
      <select value={popupType} onChange={e=>setPopupType(e.target.value)} style={{width:"100%",fontSize:"11px",border:`2px inset ${S.borderDark}`,marginBottom:"6px",padding:"2px",fontFamily:S.font}}><option value="corregir">🔴 Corregir</option><option value="sugerir">🔵 Sugerencia</option><option value="consulta">🟢 Consulta</option><option value="agregar">🟠 Falta algo</option></select>
      <textarea value={popupText} onChange={e=>setPopupText(e.target.value)} autoFocus placeholder="Tu comentario..." style={{width:"100%",height:"60px",fontFamily:S.font,fontSize:"11px",border:`2px inset ${S.borderDark}`,padding:"3px",resize:"vertical"}}/>
      <div style={{display:"flex",gap:"4px",marginTop:"6px",justifyContent:"flex-end"}}><VBtn onClick={()=>setPopup(null)} small>Cancelar</VBtn>{comments[popup.field]&&<VBtn onClick={removeComment} small style={{color:"#800000"}}>Eliminar</VBtn>}<VBtn onClick={saveComment} small style={{fontWeight:"bold"}}>Guardar</VBtn></div>
    </div>}

    {showSend&&<div style={{border:`2px outset ${S.borderLight}`,background:"#d4d0c8",padding:"10px",marginTop:"6px",fontFamily:S.font,fontSize:"11px"}}>
      <h3 style={{fontSize:"12px",color:S.blue,marginBottom:"8px"}}>📧 Enviar Comentarios</h3>
      <div style={{display:"flex",gap:"6px",alignItems:"center",marginBottom:"6px"}}><b style={{minWidth:"70px"}}>Nombre:</b><VInp value={sender} onChange={e=>setSender(e.target.value)} placeholder="Tu nombre..." style={{flex:1}}/></div>
      <div style={{display:"flex",gap:"6px",alignItems:"start",marginBottom:"6px"}}><b style={{minWidth:"70px",paddingTop:"4px"}}>Nota:</b><textarea value={nota} onChange={e=>setNota(e.target.value)} placeholder="Opcional..." style={{flex:1,fontFamily:S.font,fontSize:"11px",border:`2px inset ${S.borderDark}`,padding:"2px 4px",height:"36px"}}/></div>
      <div style={{background:"#fff",border:`2px inset ${S.borderDark}`,padding:"6px",maxHeight:"150px",overflowY:"auto",fontSize:"10px"}}>{Object.entries(comments).map(([f,d])=>(<div key={f} style={{padding:"3px 0",borderBottom:"1px dotted #c0c0c0"}}><b style={{color:S.blue}}>{f}</b> <span style={{display:"inline-block",padding:"0 4px",fontSize:"9px",fontWeight:"bold",borderRadius:"2px",background:tc[d.type]?.bg,color:tc[d.type]?.c}}>{d.type.toUpperCase()}</span><br/>{d.text}</div>))}</div>
      <div style={{display:"flex",gap:"6px",marginTop:"8px",justifyContent:"flex-end"}}><VBtn onClick={()=>setShowSend(false)} small>Cancelar</VBtn><VBtn onClick={sendToSheet} small disabled={sending} style={{background:"#d0d0ff",fontWeight:"bold"}}>{sending?"⏳...":"📧 Enviar"}</VBtn></div>
    </div>}
  </div>);
}

// === HCE PORTAL ===
function HCEPortal({project,onSelectForm,onBack}){
  const p=project.paciente;
  return(<div style={{fontFamily:S.font,fontSize:"11px"}}>
    <div style={{border:`2px outset ${S.borderLight}`,background:S.bg}}>
      <div style={{background:S.blueGrad,color:S.white,fontWeight:"bold",padding:"3px 6px",display:"flex",justifyContent:"space-between"}}><span>HCE - Historia Clínica Electrónica</span>{onBack&&<VBtn onClick={onBack} small style={{fontSize:"9px"}}>← Editor</VBtn>}</div>
      <div style={{padding:"8px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"8px",marginBottom:"8px",border:`1px solid ${S.borderDark}`,background:"#f0fff0"}}>
          <div style={{padding:"6px 10px"}}><span style={{color:S.teal,fontSize:"9px"}}>Paciente</span><div style={{fontSize:"20px",fontWeight:"bold"}}>{p.nombre||"[Nombre del Paciente]"}</div><div style={{display:"flex",gap:"12px",marginTop:"4px",fontSize:"10px"}}><span><span style={{color:S.teal}}>Nº HC:</span> <b>{p.hc||"—"}</b></span><span><span style={{color:S.teal}}>Edad:</span> <b>{p.edad||"—"}</b></span><span><span style={{color:S.teal}}>Sexo:</span> <b>{p.sexo||"—"}</b></span></div></div>
          <div style={{padding:"6px 10px",borderLeft:`1px solid ${S.borderDark}`,fontSize:"10px"}}><div style={{color:S.teal,fontSize:"9px",fontWeight:"bold"}}>Internación</div><div><b>Episodio:</b> {project.internacion.episodio||"—"}</div><div><b>Ingreso:</b> {project.internacion.ingreso||"—"}</div><div><b>Ubicación:</b> {project.internacion.ubicacion||"—"}</div><div><b>Días:</b> {project.internacion.cantDias||"—"}</div></div>
        </div>
        <div style={{border:`2px groove ${S.bg}`,padding:"4px"}}>
          <div style={{fontWeight:"bold",padding:"2px 4px",borderBottom:`1px solid ${S.borderDark}`,marginBottom:"4px",display:"flex",justifyContent:"space-between"}}><span>📋 Evoluciones / Registros</span><span style={{fontSize:"9px",color:"#666"}}>Clic para revisar</span></div>
          <div style={{border:`2px inset ${S.borderDark}`,background:"#fff"}}>
            <div style={{display:"grid",gridTemplateColumns:"110px 140px 1fr 30px",background:"#e8e8e8",fontWeight:"bold",fontSize:"9px",borderBottom:`1px solid ${S.borderDark}`}}>{["Fecha","Servicio","Evolución",""].map(h=>(<div key={h} style={{padding:"3px 4px",borderRight:"1px solid #ccc"}}>{h}</div>))}</div>
            {project.formularios.map((f,i)=>(<div key={f.id||i} onClick={()=>onSelectForm(i)} style={{display:"grid",gridTemplateColumns:"110px 140px 1fr 30px",borderBottom:"1px solid #e0e0e0",cursor:"pointer",fontSize:"10px"}} onMouseEnter={e=>e.currentTarget.style.background="#ffffcc"} onMouseLeave={e=>e.currentTarget.style.background=i%2?"#f8f8f8":"#fff"}>
              <div style={{padding:"3px 4px",borderRight:"1px solid #e0e0e0"}}>{new Date().toLocaleString("es-AR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
              <div style={{padding:"3px 4px",borderRight:"1px solid #e0e0e0"}}>{f.especialidad}</div>
              <div style={{padding:"3px 4px",borderRight:"1px solid #e0e0e0",fontWeight:"bold",color:S.blue}}>📄 {f.estudio||`Formulario ${i+1}`}</div>
              <div style={{padding:"3px 4px",textAlign:"center",fontSize:"12px"}}>→</div>
            </div>))}
            {!project.formularios.length&&<div style={{padding:"20px",textAlign:"center",color:"#808080"}}>Sin registros</div>}
          </div>
        </div>
      </div>
    </div>
  </div>);
}

// === MAIN APP ===
export default function App(){
  const[mode,setMode]=useState("loading"); // loading|editor|hce|registro|viewer_hce|viewer_registro
  const[project,setProject]=useState(defaultProject());
  const[activeFormIdx,setActiveFormIdx]=useState(0);
  const[selectedFormIdx,setSelectedFormIdx]=useState(0);
  const[publishing,setPublishing]=useState(false);
  const[publishedUrl,setPublishedUrl]=useState("");

  // Check URL params on mount
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const verId=params.get("ver");
    const sheetParam=params.get("sheet");
    if(verId&&sheetParam){
      // VIEWER MODE: load project from sheet
      loadProject(sheetParam,verId);
    } else {
      setMode("editor");
    }
  },[]);

  const loadProject=async(sheetUrl,projectId)=>{
    try{
      const resp=await fetch(`${sheetUrl}?id=${projectId}`);
      const data=await resp.json();
      if(data.status==="ok"&&data.project){
        setProject({...defaultProject(),...data.project,sheetUrl});
        setMode("viewer_hce");
      } else {
        alert("No se pudo cargar el proyecto.");setMode("editor");
      }
    }catch{
      alert("Error de conexión.");setMode("editor");
    }
  };

  const publishProject=async()=>{
    if(!project.sheetUrl){alert("⚠️ Primero configurá la URL del Google Sheet.");return;}
    setPublishing(true);
    const projectId="p"+Date.now();
    try{
      const payload={action:"save_project",projectId,paciente:project.paciente.nombre||"(sin paciente)",project};
      await fetch(project.sheetUrl,{method:"POST",body:JSON.stringify(payload),mode:"no-cors"});
      const baseUrl=window.location.origin+window.location.pathname;
      const url=`${baseUrl}?ver=${projectId}&sheet=${encodeURIComponent(project.sheetUrl)}`;
      setPublishedUrl(url);
      alert("✅ ¡Publicado! Copiá el link para el usuario.");
    }catch{alert("❌ Error al publicar.");}
    setPublishing(false);
  };

  const updProject=(f,v)=>setProject(p=>({...p,[f]:v}));
  const updPaciente=(f,v)=>setProject(p=>({...p,paciente:{...p.paciente,[f]:v}}));
  const updInternacion=(f,v)=>setProject(p=>({...p,internacion:{...p.internacion,[f]:v}}));
  const updForm=(idx,nf)=>setProject(p=>{const f=[...p.formularios];f[idx]=nf;return{...p,formularios:f};});
  const addForm=()=>setProject(p=>({...p,formularios:[...p.formularios,defaultForm()]}));
  const removeForm=idx=>setProject(p=>({...p,formularios:p.formularios.filter((_,i)=>i!==idx)}));

  const exportProject=()=>{const b=new Blob([JSON.stringify(project,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`${project.paciente.nombre||"proyecto"}.json`;a.click();};
  const importProject=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.formularios){setProject({...defaultProject(),...d});alert("✅ Importado");}else alert("❌ Formato inválido");}catch{alert("❌ Error");}};r.readAsText(f);};input.click();};

  if(mode==="loading")return(<div style={{fontFamily:S.font,background:S.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{border:`2px outset ${S.borderLight}`,background:S.bg,padding:"40px",textAlign:"center"}}><div style={{fontSize:"14px",fontWeight:"bold",color:S.blue}}>⏳ Cargando proyecto...</div></div></div>);

  // === VIEWER MODES (what the user sees) ===
  if(mode==="viewer_hce")return(<div style={{fontFamily:S.font,background:S.bg,minHeight:"100vh",padding:"6px"}}><HCEPortal project={project} onSelectForm={idx=>{setSelectedFormIdx(idx);setMode("viewer_registro");}}/></div>);
  if(mode==="viewer_registro")return(<div style={{fontFamily:S.font,background:S.bg,minHeight:"100vh",padding:"6px"}}><RegistroView form={project.formularios[selectedFormIdx]} sheetUrl={project.sheetUrl} paciente={project.paciente} onBack={()=>setMode("viewer_hce")}/></div>);

  // === HCE preview (editor mode) ===
  if(mode==="hce")return(<div style={{fontFamily:S.font,background:S.bg,minHeight:"100vh",padding:"6px"}}><HCEPortal project={project} onBack={()=>setMode("editor")} onSelectForm={idx=>{setSelectedFormIdx(idx);setMode("registro");}}/></div>);
  if(mode==="registro")return(<div style={{fontFamily:S.font,background:S.bg,minHeight:"100vh",padding:"6px"}}><RegistroView form={project.formularios[selectedFormIdx]} sheetUrl={project.sheetUrl} paciente={project.paciente} onBack={()=>setMode("hce")}/></div>);

  // === EDITOR MODE ===
  return(<div style={{fontFamily:S.font,fontSize:"11px",background:S.bg,minHeight:"100vh",padding:"6px"}}>
    <div style={{display:"flex",gap:"4px",marginBottom:"6px",alignItems:"center",padding:"4px",border:`2px groove ${S.bg}`,flexWrap:"wrap"}}>
      <b style={{fontSize:"12px",color:S.blue}}>SISGH Mockup Builder</b><Sep/>
      <VBtn onClick={()=>setMode("hce")} style={{background:"#d0ffd0"}}>👁️ Preview</VBtn>
      <VBtn onClick={publishProject} disabled={publishing} style={{background:"#ffd0d0",fontWeight:"bold"}}>{publishing?"⏳...":"🚀 Publicar para Usuario"}</VBtn>
      <Sep/>
      <VBtn onClick={exportProject} small>📤</VBtn>
      <VBtn onClick={importProject} small>📥</VBtn>
      <div style={{flex:1}}/>
      <VBtn onClick={()=>{if(window.confirm("¿Nuevo?"))setProject(defaultProject());}} small style={{color:"#800000"}}>🔄</VBtn>
    </div>

    {publishedUrl&&(<div style={{background:"#e8ffe8",border:"2px solid #00aa00",padding:"8px",marginBottom:"6px",fontFamily:S.font,fontSize:"11px"}}>
      <b style={{color:"#006600"}}>✅ Link para el usuario:</b><br/>
      <div style={{display:"flex",gap:"4px",marginTop:"4px",alignItems:"center"}}>
        <input value={publishedUrl} readOnly style={{flex:1,fontFamily:"Consolas,monospace",fontSize:"10px",border:`2px inset ${S.borderDark}`,padding:"3px"}} onClick={e=>e.target.select()}/>
        <VBtn onClick={()=>{navigator.clipboard.writeText(publishedUrl);alert("✅ Copiado!");}} small>📋 Copiar</VBtn>
      </div>
      <div style={{fontSize:"9px",color:"#666",marginTop:"4px"}}>Mandá este link al usuario. Solo va a ver la HCE para revisar, no el editor.</div>
    </div>)}

    <div style={{border:`2px outset ${S.borderLight}`,background:S.bg,marginBottom:"6px"}}>
      <div style={{background:S.blueGrad,color:S.white,fontWeight:"bold",padding:"3px 6px"}}>📋 Paciente y Configuración</div>
      <div style={{padding:"8px"}}>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 1fr auto 1fr auto 80px",gap:"4px 8px",alignItems:"center",marginBottom:"6px"}}>
          <b>Nombre</b><VInp value={project.paciente.nombre} onChange={e=>updPaciente("nombre",e.target.value)} placeholder="Apellido, Nombre" style={{width:"100%"}}/>
          <b>HC</b><VInp value={project.paciente.hc} onChange={e=>updPaciente("hc",e.target.value)} placeholder="84869" style={{width:"100%"}}/>
          <b>Edad</b><VInp value={project.paciente.edad} onChange={e=>updPaciente("edad",e.target.value)} placeholder="89" style={{width:"60px"}}/>
          <b>Sexo</b><VSel value={project.paciente.sexo} onChange={e=>updPaciente("sexo",e.target.value)} options={["Fem","Masc"]}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto 1fr auto 1fr auto 1fr",gap:"4px 8px",alignItems:"center",marginBottom:"6px"}}>
          <b>Episodio</b><VInp value={project.internacion.episodio} onChange={e=>updInternacion("episodio",e.target.value)} style={{width:"100%"}}/>
          <b>Ingreso</b><VInp value={project.internacion.ingreso} onChange={e=>updInternacion("ingreso",e.target.value)} placeholder="dd/mm/aaaa" style={{width:"100%"}}/>
          <b>Ubicación</b><VInp value={project.internacion.ubicacion} onChange={e=>updInternacion("ubicacion",e.target.value)} style={{width:"100%"}}/>
          <b>Días</b><VInp value={project.internacion.cantDias} onChange={e=>updInternacion("cantDias",e.target.value)} style={{width:"60px"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 8px",alignItems:"center",borderTop:`1px solid ${S.borderDark}`,paddingTop:"6px"}}>
          <b>Google Sheet URL</b><VInp value={project.sheetUrl} onChange={e=>updProject("sheetUrl",e.target.value)} placeholder="https://script.google.com/macros/s/XXXX/exec" style={{width:"100%"}}/>
        </div>
      </div>
    </div>

    <div style={{border:`2px outset ${S.borderLight}`,background:S.bg}}>
      <div style={{background:S.blueGrad,color:S.white,fontWeight:"bold",padding:"3px 6px",display:"flex",justifyContent:"space-between"}}><span>📝 Formularios ({project.formularios.length})</span><VBtn onClick={addForm} small style={{fontSize:"9px"}}>➕ Agregar</VBtn></div>
      <div style={{padding:"4px 8px"}}>
        <div style={{display:"flex",gap:"2px",marginBottom:"6px",flexWrap:"wrap"}}>{project.formularios.map((f,i)=>(<div key={f.id||i} style={{display:"flex",alignItems:"center"}}><VBtn active={activeFormIdx===i} onClick={()=>setActiveFormIdx(i)} small>{f.estudio||`Form ${i+1}`}</VBtn>{project.formularios.length>1&&<span onClick={()=>{if(window.confirm("¿Eliminar?")){removeForm(i);if(activeFormIdx>=i&&activeFormIdx>0)setActiveFormIdx(activeFormIdx-1);}}} style={{cursor:"pointer",fontSize:"9px",color:"#800000",padding:"0 3px"}}>✕</span>}</div>))}</div>
        {project.formularios[activeFormIdx]&&<FormEditor form={project.formularios[activeFormIdx]} setForm={nf=>updForm(activeFormIdx,nf)}/>}
      </div>
    </div>
  </div>);
}
