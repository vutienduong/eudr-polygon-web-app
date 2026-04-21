import L from "leaflet";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Database,
  Download,
  FileJson,
  FileText,
  Filter,
  Globe2,
  Layers,
  Lock,
  LogIn,
  Map,
  MapPin,
  PackagePlus,
  Plus,
  Route,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { area as turfArea, booleanValid, centroid as turfCentroid } from "@turf/turf";
import type { Feature, GeoJsonProperties, Geometry, Polygon } from "geojson";
import { batches, exportRecords, movements, parcels } from "./data";
import type { Batch, Parcel, Status } from "./types";

type RouteId =
  | "login"
  | "dashboard"
  | "parcels"
  | "parcel-new"
  | "parcel-detail"
  | "batches"
  | "batch-new"
  | "batch-detail"
  | "traceability"
  | "export"
  | "exports";

const routes: Record<string, RouteId> = {
  "#/login": "login",
  "#/dashboard": "dashboard",
  "#/parcels": "parcels",
  "#/parcels/new": "parcel-new",
  "#/parcels/detail": "parcel-detail",
  "#/batches": "batches",
  "#/batches/new": "batch-new",
  "#/batches/detail": "batch-detail",
  "#/traceability": "traceability",
  "#/export": "export",
  "#/exports": "exports",
};

const routeToHash = (route: RouteId) => Object.entries(routes).find(([, value]) => value === route)?.[0] ?? "#/dashboard";

const navigate = (route: RouteId) => {
  window.location.hash = routeToHash(route);
};

function useHashRoute() {
  const [route, setRoute] = useState<RouteId>(() => routes[window.location.hash] ?? "dashboard");

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "#/dashboard";
    }
    const onHashChange = () => setRoute(routes[window.location.hash] ?? "dashboard");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

export function App() {
  const route = useHashRoute();

  if (route === "login") {
    return <LoginScreen />;
  }

  return (
    <AppShell route={route}>
      {route === "dashboard" && <Dashboard />}
      {route === "parcels" && <ParcelList />}
      {route === "parcel-new" && <CreateParcel />}
      {route === "parcel-detail" && <ParcelDetail parcel={parcels[0]} />}
      {route === "batches" && <BatchList />}
      {route === "batch-new" && <CreateBatch />}
      {route === "batch-detail" && <BatchDetail batch={batches[0]} />}
      {route === "traceability" && <TraceabilityTimeline />}
      {route === "export" && <ExportReport />}
      {route === "exports" && <ExportHistory />}
    </AppShell>
  );
}

function AppShell({ children, route }: { children: React.ReactNode; route: RouteId }) {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <Route size={22} />
          </div>
          <div>
            <strong>Geo-Spatial Anchor</strong>
            <span>EUDR Compliance Ledger</span>
          </div>
        </div>

        <button className="primary-button wide" onClick={() => navigate("parcel-new")}>
          <Plus size={16} /> New Parcel
        </button>

        <nav className="side-nav">
          <NavItem active={route === "dashboard"} icon={BarChart3} label="Dashboard" to="dashboard" />
          <NavItem active={route.startsWith("parcel")} icon={Map} label="Parcels" to="parcels" />
          <NavItem active={route.startsWith("batch")} icon={Database} label="Batches" to="batches" />
          <NavItem active={route === "traceability"} icon={Route} label="Traceability" to="traceability" />
          <NavItem active={route === "export" || route === "exports"} icon={Share2} label="Export" to="export" />
        </nav>

        <div className="side-footer">
          <button className="ghost-nav"><Settings size={18} /> Settings</button>
          <button className="ghost-nav"><ShieldCheck size={18} /> Support</button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <strong>The Sovereign Ledger</strong>
            <nav>
              <button onClick={() => navigate("dashboard")}>Dashboard</button>
              <button onClick={() => navigate("parcels")}>Parcels</button>
              <button onClick={() => navigate("batches")}>Batches</button>
            </nav>
          </div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={16} />
              <input placeholder="Search ledgers..." />
            </label>
            <button className="secondary-button" onClick={() => navigate("export")}>Export Report</button>
            <div className="avatar">DV</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function NavItem({
  active,
  icon: Icon,
  label,
  to,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  to: RouteId;
}) {
  return (
    <button className={active ? "nav-item active" : "nav-item"} onClick={() => navigate(to)}>
      <Icon size={20} />
      {label}
    </button>
  );
}

function LoginScreen() {
  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="brand-block light">
          <div className="brand-mark pale"><Route size={24} /></div>
          <div>
            <strong>Geo-Spatial Anchor</strong>
            <span>EUDR Compliance Ledger</span>
          </div>
        </div>
        <div>
          <h1>Anchor land evidence to every shipment.</h1>
          <p>Secure access for parcel validation, batch traceability, and export-ready compliance packages.</p>
        </div>
        <div className="login-proof">
          <ShieldCheck size={18} />
          Trusted by operators preparing EU due diligence ledgers
        </div>
      </div>
      <form
        className="login-form"
        onSubmit={(event) => {
          event.preventDefault();
          navigate("dashboard");
        }}
      >
        <header>
          <span className="eyebrow">Secure Authentication</span>
          <h2>Access your ledger</h2>
          <p>Use any email and password for this MVP demo.</p>
        </header>
        <label>
          Work Email
          <input required type="email" placeholder="name@organization.com" />
        </label>
        <label>
          Password
          <input required type="password" placeholder="password" />
        </label>
        <button className="primary-button wide" type="submit">
          <LogIn size={18} /> Enter Platform
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  return (
    <section className="page dashboard-page">
      <div className="metrics-grid">
        <Metric title="Global Footprint" value="1,284" label="Total Parcels" detail="+12.4% vs LY" />
        <Metric title="Logistics Pipeline" value="412" label="Active Batches" detail="98% Validated" />
        <div className="map-card">
          <div className="satellite-texture" />
          <div className="map-overlay">
            <strong>Live Geofence</strong>
            <span>Mato Grosso Sector 4</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <ActionTile icon={MapPin} title="Add Parcel" subtitle="Onboard new coordinates" to="parcel-new" />
        <ActionTile icon={PackagePlus} title="Create Batch" subtitle="Consolidate harvests" to="batch-new" />
        <ActionTile dark icon={FileText} title="Export Report" subtitle="EUDR compliance PDF" to="export" />
      </div>

      <section className="data-section">
        <SectionHeader title="Export Ledger" subtitle="Immutable audit trail of recent compliance filings" action="View All Activity" to="exports" />
        <ExportTable />
      </section>

      <div className="sync-banner">
        <div className="brand-mark"><ShieldCheck size={21} /></div>
        <div>
          <strong>Ledger Synchronized</strong>
          <span>Your compliance data is currently matched with global satellite registries.</span>
        </div>
        <span className="integrity">System Integrity 100%</span>
      </div>
    </section>
  );
}

function ParcelList() {
  const [query, setQuery] = useState("");
  const filtered = parcels.filter((parcel) =>
    [parcel.code, parcel.owner, parcel.commodity, parcel.province].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="page">
      <PageHeading
        eyebrow="Parcel Management"
        title="Validated land ledger"
        description="Manage source polygons, legal evidence, and commodity metadata before linking harvest batches."
        actionLabel="Add Parcel"
        onAction={() => navigate("parcel-new")}
      />

      <div className="toolbar">
        <label className="search-box large">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter parcels by code, owner, crop, or region" />
        </label>
        <button className="secondary-button"><Filter size={16} /> Province</button>
        <button className="secondary-button"><Layers size={16} /> Commodity</button>
      </div>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Parcel Code</th>
              <th>Owner</th>
              <th>Commodity</th>
              <th>Area</th>
              <th>Province</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((parcel) => (
              <tr key={parcel.id} onClick={() => navigate("parcel-detail")}>
                <td><strong>{parcel.code}</strong><span>{parcel.farmName}</span></td>
                <td>{parcel.owner}</td>
                <td>{parcel.commodity}</td>
                <td>{parcel.areaHa.toLocaleString()} ha</td>
                <td>{parcel.province}</td>
                <td><StatusChip status={parcel.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CreateParcel() {
  const [validation, setValidation] = useState<{
    name: string;
    valid: boolean;
    areaHa: number;
    centroid: string;
    message: string;
    feature?: Feature<Polygon>;
  }>(() => ({
    name: "Sample boundary",
    valid: true,
    areaHa: Math.round((turfArea(parcels[0].polygon) / 10000) * 100) / 100,
    centroid: parcels[0].centroid.join(", "),
    message: "Sample GeoJSON polygon is ready for review.",
    feature: parcels[0].polygon,
  }));

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as Feature<Geometry, GeoJsonProperties>;
      if (parsed.type !== "Feature" || parsed.geometry.type !== "Polygon") {
        throw new Error("Only GeoJSON Feature polygons are supported in this MVP.");
      }
      const center = turfCentroid(parsed);
      setValidation({
        name: file.name,
        valid: booleanValid(parsed),
        areaHa: Math.round((turfArea(parsed) / 10000) * 100) / 100,
        centroid: center.geometry.coordinates.map((value) => value.toFixed(5)).join(", "),
        message: booleanValid(parsed) ? "Polygon geometry passed the MVP validation checks." : "Polygon geometry is invalid.",
        feature: parsed as Feature<Polygon>,
      });
    } catch (error) {
      setValidation({
        name: file.name,
        valid: false,
        areaHa: 0,
        centroid: "Unavailable",
        message: error instanceof Error ? error.message : "Unable to parse GeoJSON.",
      });
    }
  };

  return (
    <section className="page split-page">
      <div className="form-panel">
        <button className="back-link" onClick={() => navigate("parcels")}><ChevronLeft size={16} /> Back to Parcels</button>
        <StepRail active={2} />
        <div className="section-card accented">
          <span className="eyebrow">Step 2</span>
          <h2>Polygon Mapping</h2>
          <p>Define precise cultivation boundaries. Imported polygons are checked before they can be attached to a parcel record.</p>

          <div className="method-grid">
            <label className="method selected">
              <Upload size={22} />
              Upload GeoJSON
              <input className="visually-hidden" type="file" accept=".json,.geojson,application/geo+json,application/json" onChange={onFile} />
            </label>
            <button className="method" type="button"><Map size={22} /> Manual Draw</button>
          </div>

          <div className="validation-box">
            <div>
              <span>File</span>
              <strong>{validation.name}</strong>
            </div>
            <div>
              <span>Centroid</span>
              <strong>{validation.centroid}</strong>
            </div>
            <div>
              <span>Total Hectares</span>
              <strong>{validation.areaHa.toLocaleString()} ha</strong>
            </div>
          </div>

          <div className={validation.valid ? "notice success" : "notice warning"}>
            {validation.valid ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {validation.message}
          </div>

          <div className="button-row">
            <button className="secondary-button" onClick={() => navigate("parcels")}>Save Draft</button>
            <button className="primary-button" onClick={() => navigate("parcel-detail")}>Validate & Proceed <ArrowRight size={16} /></button>
          </div>
        </div>
      </div>

      <div className="map-hero">
        <LeafletMap parcel={validation.feature ? { ...parcels[0], polygon: validation.feature } : parcels[0]} />
        <div className="glass telemetry">
          <span className="eyebrow">Live Boundary Telemetry</span>
          <strong>Parcel ID: EUDR-BR-AM-4029</strong>
          <span>{validation.valid ? "High precision geometry" : "Boundary needs attention"}</span>
        </div>
      </div>
    </section>
  );
}

function ParcelDetail({ parcel }: { parcel: Parcel }) {
  return (
    <section className="detail-workspace">
      <div className="detail-map">
        <LeafletMap parcel={parcel} />
        <div className="glass map-coordinates">
          <span>Geographic Coordinates</span>
          <code>Lat: {parcel.centroid[0]}</code>
          <code>Lon: {parcel.centroid[1]}</code>
        </div>
        <div className="map-seal"><ShieldCheck size={18} /> EUDR Compliant 2024</div>
      </div>
      <aside className="detail-ledger">
        <div className="title-row">
          <div>
            <span className="eyebrow">Parcel Detail</span>
            <h2>{parcel.code}</h2>
          </div>
          <StatusChip status={parcel.status} />
        </div>
        <div className="button-row">
          <button className="primary-button"><Upload size={16} /> Upload Document</button>
          <button className="secondary-button" onClick={() => downloadGeoJson(parcel)}><FileJson size={16} /> GeoJSON</button>
        </div>
        <div className="metadata-grid">
          <Info label="Parcel Owner" value={parcel.owner} />
          <Info label="Commodity Type" value={parcel.commodity} />
          <Info label="Cultivation Area" value={`${parcel.areaHa.toLocaleString()} Hectares`} />
          <Info label="Region" value={`${parcel.province}, ${parcel.country}`} />
        </div>
        <section>
          <SectionHeader title="Compliance Documents" subtitle={`${parcel.documents.length} files attached`} />
          <div className="document-list">
            {parcel.documents.map((document) => (
              <button key={document} className="document-item">
                <FileText size={20} />
                <span>{document}<small>Uploaded to parcel ledger</small></span>
                <Download size={17} />
              </button>
            ))}
          </div>
        </section>
        <section className="risk-panel">
          <h3>Risk Notes</h3>
          {parcel.riskNotes.map((note) => <p key={note}>{note}</p>)}
        </section>
      </aside>
    </section>
  );
}

function BatchList() {
  return (
    <section className="page">
      <PageHeading
        eyebrow="Batch Management"
        title="Commodity movement pipeline"
        description="Link harvest lots to parcel evidence and track each batch through the supply chain."
        actionLabel="Create Batch"
        onAction={() => navigate("batch-new")}
      />
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Commodity</th>
              <th>Quantity</th>
              <th>Source Parcels</th>
              <th>Holder</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id} onClick={() => navigate("batch-detail")}>
                <td><strong>{batch.code}</strong><span>{batch.harvestDate}</span></td>
                <td>{batch.commodity}</td>
                <td>{batch.quantityKg.toLocaleString()} kg</td>
                <td>{batch.sourceParcelIds.length}</td>
                <td>{batch.currentHolder}</td>
                <td><StatusChip status={batch.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dark-callout">
        <div>
          <span className="eyebrow">Validated Footprint</span>
          <h3>1,240 total hectares linked to active batches</h3>
        </div>
        <button onClick={() => navigate("export")}>Prepare Export</button>
      </div>
    </section>
  );
}

function CreateBatch() {
  const [selected, setSelected] = useState<string[]>(["parcel-90432"]);
  const totalArea = parcels.filter((parcel) => selected.includes(parcel.id)).reduce((sum, parcel) => sum + parcel.areaHa, 0);

  return (
    <section className="page split-page batch-create">
      <div className="form-panel wide-panel">
        <PageHeading eyebrow="Batch Creation" title="Consolidate harvest evidence" description="Select parcels, assign quantity, and validate that the claimed batch sources are compatible." />
        <div className="section-card">
          <span className="eyebrow">Step 1</span>
          <h2>Batch Parameters</h2>
          <div className="input-grid">
            <label>Commodity<select defaultValue="Coffee"><option>Coffee</option><option>Soybean</option><option>Rubber</option></select></label>
            <label>Quantity (kg)<input defaultValue="45000" type="number" /></label>
          </div>
        </div>
        <div className="section-card">
          <div className="title-row">
            <div>
              <span className="eyebrow">Step 2</span>
              <h2>Source Parcels</h2>
            </div>
            <span className="area-total">{totalArea.toLocaleString()} ha selected</span>
          </div>
          <div className="parcel-picker">
            {parcels.map((parcel) => (
              <label key={parcel.id} className={selected.includes(parcel.id) ? "pick-row selected" : "pick-row"}>
                <input
                  checked={selected.includes(parcel.id)}
                  type="checkbox"
                  onChange={(event) => {
                    setSelected((current) => event.target.checked ? [...current, parcel.id] : current.filter((id) => id !== parcel.id));
                  }}
                />
                <span><strong>{parcel.code}</strong>{parcel.farmName}</span>
                <small>{parcel.areaHa.toLocaleString()} ha</small>
              </label>
            ))}
          </div>
          <div className="button-row">
            <button className="secondary-button" onClick={() => navigate("batches")}>Cancel</button>
            <button className="primary-button" onClick={() => navigate("batch-detail")}>Create Batch</button>
          </div>
        </div>
      </div>
      <div className="map-hero compact">
        <LeafletMap parcel={parcels.find((parcel) => selected.includes(parcel.id)) ?? parcels[0]} />
        <div className="glass telemetry">
          <span className="eyebrow">Batch Source Monitor</span>
          <strong>{selected.length} source parcel(s)</strong>
          <span>No commodity mismatch detected.</span>
        </div>
      </div>
    </section>
  );
}

function BatchDetail({ batch }: { batch: Batch }) {
  const sources = parcels.filter((parcel) => batch.sourceParcelIds.includes(parcel.id));
  return (
    <section className="page">
      <PageHeading eyebrow="Batch Detail" title={batch.code} description={`${batch.commodity} batch held by ${batch.currentHolder}`} actionLabel="Export Metadata" onAction={() => downloadBatchJson(batch)} />
      <div className="detail-grid">
        <div className="section-card">
          <h2>Batch Info</h2>
          <div className="metadata-grid">
            <Info label="Commodity" value={batch.commodity} />
            <Info label="Quantity" value={`${batch.quantityKg.toLocaleString()} kg`} />
            <Info label="Harvest Date" value={batch.harvestDate} />
            <Info label="Status" value={batch.status} />
          </div>
        </div>
        <div className="section-card">
          <SectionHeader title="Source Parcels" subtitle={`${sources.length} linked parcels`} />
          <div className="document-list">
            {sources.map((parcel) => (
              <button className="document-item" key={parcel.id} onClick={() => navigate("parcel-detail")}>
                <MapPin size={18} />
                <span>{parcel.code}<small>{parcel.farmName} - {parcel.areaHa} ha</small></span>
                <StatusChip status={parcel.status} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <TraceabilityTimeline embedded />
    </section>
  );
}

function TraceabilityTimeline({ embedded = false }: { embedded?: boolean }) {
  const selectedBatch = batches[0];
  const batchMovements = movements.filter((movement) => movement.batchId === selectedBatch.id);
  return (
    <section className={embedded ? "section-card timeline-card" : "page"}>
      {!embedded && <PageHeading eyebrow="Movement Ledger" title="Batch movement timeline" description="Manual chain of custody tracking from farm origin to export terminal." actionLabel="Add Movement" />}
      <div className="timeline">
        {batchMovements.map((movement, index) => (
          <div className="timeline-item" key={movement.id}>
            <div className="timeline-node">{index + 1}</div>
            <div>
              <span className="eyebrow">{movement.type}</span>
              <h3>{movement.from} {"->"} {movement.to}</h3>
              <p>{movement.quantityKg.toLocaleString()} kg moved on {movement.movedAt}</p>
              <small>{movement.reference}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExportReport() {
  const [includeRaw, setIncludeRaw] = useState(false);
  const selectedBatch = batches[0];
  const linkedParcels = parcels.filter((parcel) => selectedBatch.sourceParcelIds.includes(parcel.id));

  return (
    <section className="page export-page">
      <PageHeading eyebrow="Export Compliance Ledger" title="Generate EUDR package" description="Select a shipment and produce machine-readable geolocation data plus compliance metadata." actionLabel="History" onAction={() => navigate("exports")} />
      <div className="export-grid">
        <div>
          <div className="shipment-card selected">
            <input checked readOnly type="checkbox" />
            <div>
              <span className="eyebrow">Shipment ID: {selectedBatch.code}</span>
              <h3>Amazonas Arabica Batch A-4</h3>
              <p>{selectedBatch.quantityKg.toLocaleString()} kg - {linkedParcels.length} source parcels</p>
            </div>
            <StatusChip status={selectedBatch.status} />
          </div>
          <div className="source-grid">
            {linkedParcels.map((parcel) => (
              <div className="source-card" key={parcel.id}>
                <MapPin size={22} />
                <div>
                  <strong>{parcel.code}</strong>
                  <span>{parcel.farmName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card export-config">
          <div className="mini-map">
            <LeafletMap parcel={linkedParcels[0]} />
          </div>
          <h2>Report Parameters</h2>
          <label className="check-row"><FileText size={18} /> Compliance PDF (Official)<input checked readOnly type="checkbox" /></label>
          <label className="check-row"><Lock size={18} /> GeoJSON Coordinates<input checked readOnly type="checkbox" /></label>
          <label className="check-row muted"><FileJson size={18} /> JSON Raw Ledger<input checked={includeRaw} onChange={(event) => setIncludeRaw(event.target.checked)} type="checkbox" /></label>
          <button className="primary-button wide" onClick={() => downloadExportPackage(selectedBatch, linkedParcels, includeRaw)}>
            <Download size={18} /> Generate Compliance Report
          </button>
        </div>
      </div>
    </section>
  );
}

function ExportHistory() {
  return (
    <section className="page">
      <PageHeading eyebrow="Export Archive" title="Submission history" description="Review generated compliance packages and their validation status." actionLabel="Generate New" onAction={() => navigate("export")} />
      <ExportTable />
      <div className="dark-callout">
        <div>
          <span className="eyebrow">Export Format</span>
          <h3>Every package includes GeoJSON and traceability metadata.</h3>
        </div>
        <button onClick={() => navigate("export")}>Create Report</button>
      </div>
    </section>
  );
}

function LeafletMap({ parcel }: { parcel: Parcel }) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(elementRef.current, { zoomControl: false, attributionControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);
      L.control.zoom({ position: "bottomleft" }).addTo(mapRef.current);
    }

    const map = mapRef.current;
    const layer = L.geoJSON(parcel.polygon, {
      style: {
        color: "#00261b",
        fillColor: "#bcedd7",
        fillOpacity: 0.38,
        weight: 3,
      },
    }).addTo(map);
    map.fitBounds(layer.getBounds(), { padding: [30, 30], maxZoom: 13 });

    return () => {
      layer.remove();
    };
  }, [parcel]);

  return <div className="leaflet-host" ref={elementRef} />;
}

function Metric({ title, value, label, detail }: { title: string; value: string; label: string; detail: string }) {
  return (
    <div className="metric-card">
      <span className="eyebrow">{title}</span>
      <strong>{value}</strong>
      <div><b>{label}</b><span>{detail}</span></div>
    </div>
  );
}

function ActionTile({ dark, icon: Icon, title, subtitle, to }: { dark?: boolean; icon: LucideIcon; title: string; subtitle: string; to: RouteId }) {
  return (
    <button className={dark ? "action-tile dark" : "action-tile"} onClick={() => navigate(to)}>
      <span><Icon size={22} /></span>
      <strong>{title}</strong>
      <small>{subtitle}</small>
    </button>
  );
}

function SectionHeader({ title, subtitle, action, to }: { title: string; subtitle?: string; action?: string; to?: RouteId }) {
  return (
    <header className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <button onClick={() => to && navigate(to)}>{action} <ArrowRight size={14} /></button>}
    </header>
  );
}

function PageHeading({ eyebrow, title, description, actionLabel, onAction }: { eyebrow: string; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <header className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actionLabel && <button className="primary-button" onClick={onAction}>{actionLabel}</button>}
    </header>
  );
}

function StatusChip({ status }: { status: Status }) {
  return <span className={`status-chip ${status.toLowerCase().replace(" ", "-")}`}>{status}</span>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StepRail({ active }: { active: number }) {
  const steps = ["Basic Info", "Polygon Definition", "Documentation"];
  return (
    <div className="step-rail">
      {steps.map((step, index) => (
        <div className={index + 1 <= active ? "step active" : "step"} key={step}>
          <span>{index + 1}</span>
          <strong>{step}</strong>
        </div>
      ))}
    </div>
  );
}

function ExportTable() {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Timestamp</th>
            <th>Jurisdiction</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {exportRecords.map((record) => (
            <tr key={record.id}>
              <td><strong>{record.reportId}</strong><span>{record.commodity} | {record.parcelCount} Parcels</span></td>
              <td>{record.createdAt}</td>
              <td><Globe2 size={15} /> {record.jurisdiction}</td>
              <td><StatusChip status={record.status} /></td>
              <td><button className="icon-button" onClick={() => downloadJson(`${record.reportId}.json`, record)}><Download size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadGeoJson(parcel: Parcel) {
  downloadJson(`${parcel.code}.geojson`, parcel.polygon);
}

function downloadBatchJson(batch: Batch) {
  downloadJson(`${batch.code}.json`, {
    batch,
    sourceParcels: parcels.filter((parcel) => batch.sourceParcelIds.includes(parcel.id)),
    movements: movements.filter((movement) => movement.batchId === batch.id),
  });
}

function downloadExportPackage(batch: Batch, linkedParcels: Parcel[], includeRaw: boolean) {
  downloadJson(`${batch.code}-eudr-package.json`, {
    generatedAt: new Date().toISOString(),
    batch,
    geojson: {
      type: "FeatureCollection",
      features: linkedParcels.map((parcel) => parcel.polygon),
    },
    traceability: movements.filter((movement) => movement.batchId === batch.id),
    rawLedgerIncluded: includeRaw,
  });
}
