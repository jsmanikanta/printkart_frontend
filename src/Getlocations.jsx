import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import "./styles/getlocations.css";

export default function PickupAddress() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const fetchLocations = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setErrorMsg("Please login to view addresses.");
      setUser(null);
      setLocations([]);
      return;
    }
    setLoading(true);
    setErrorMsg("");

    let alive = true;

    try {
      const res = await axios.get(`${api_path}/locations/mylocations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!alive) return;

      const fetchedUser = res?.data?.user || null;
      const list = Array.isArray(res?.data?.locations) ? res.data.locations : [];

      setUser(fetchedUser);
      setLocations(list);

      setSelectedIndex((prev) => {
        if (list.length === 0) return 0;
        return Math.min(prev, list.length - 1);
      });
    } catch (err) {
      if (!alive) return;

      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load locations.";

      setErrorMsg(msg);
      setUser(null);
      setLocations([]);
    } finally {
      if (alive) setLoading(false);
    }

    return () => {
      alive = false;
    };
  }, [token]);

  useEffect(() => {
    let cleanup;
    (async () => {
      cleanup = await fetchLocations();
    })();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [fetchLocations]);

  const formatAddress = (loc) => {
    const parts = [loc?.address, loc?.landmark, loc?.district, loc?.state, loc?.pincode]
      .map((x) => (typeof x === "string" ? x.trim() : x != null ? String(x).trim() : ""))
      .filter(Boolean);

    return parts.join(", ");
  };
  const getPhone = (loc) => {
    const phone =
      (loc?.mobilenumber != null && String(loc.mobilenumber).trim()) ||
      (user?.mobileNumber != null && String(user.mobileNumber).trim()) ||
      "";
    return phone;
  };

  const goBack = () => navigate(-1);
  const onAddNew = () => navigate("/addlocation");

  const onSelect = (idx) => setSelectedIndex(idx);

  return (
    <div className="pa-page">
      <div className="pa-topbar">
        <button className="pa-backBtn" onClick={goBack} aria-label="Back">
          <span className="pa-backIcon">←</span>
        </button>

        <div className="pa-titleWrap">
          <div className="pa-title">Pickup Address</div>
        </div>
      </div>

      <div className="pa-content">
        <button className="pa-rowBtn" onClick={onAddNew}>
          <span className="pa-rowText">Add a new address</span>
          <span className="pa-rowChevron">›</span>
        </button>

        <div className="pa-sectionLabel">Present Address</div>

        {loading ? (
          <div className="pa-stateText">Loading…</div>
        ) : errorMsg ? (
          <div className="pa-errorBox">
            <div className="pa-errorTitle">Couldn’t load addresses</div>
            <div className="pa-errorMsg">{errorMsg}</div>
            <button className="pa-retryBtn" onClick={fetchLocations}>
              Retry
            </button>
          </div>
        ) : locations.length === 0 ? (
          <div className="pa-emptyBox">
            <div className="pa-emptyTitle">No addresses found</div>
            <div className="pa-emptyMsg">Add a new address to continue.</div>
            <button className="pa-primaryBtn" onClick={onAddNew}>
              Add address
            </button>
          </div>
        ) : (
          <div className="pa-cards">
            {locations.map((loc, idx) => {
              const isSelected = idx === selectedIndex;

              // ✅ FIX: show location name first (not user fullname)
              const name = (loc?.name || user?.fullname || "Name").toString();

              const addr = formatAddress(loc);
              const phone = getPhone(loc);

              return (
                <div
                  key={loc?._id || `${idx}-${loc?.pincode || ""}`}
                  className={`pa-card ${isSelected ? "isSelected" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(idx);
                  }}
                >
                  <div className="pa-cardInner">
                    <div className="pa-name">{name}</div>

                    <div className="pa-address">{addr || "—"}</div>

                    {phone ? (
                      <div className="pa-phone">
                        <span className="pa-phoneLabel">Phone number:</span>{" "}
                        <span className="pa-phoneValue">{phone}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
