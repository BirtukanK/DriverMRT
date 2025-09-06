import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function FilterPanel({ config, value, onChange, onReset }) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  const handleApply = () => onChange(local);
  const handleReset = () => onReset();

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          {config.filters.map((filter) => {
            const { key, type, labelKey, options = [], placeholderKey, presets = [] } = filter;
            const currentValue = local[key];

            // Text filter
            if (type === "text") {
              return (
                <Grid item xs={12} md={4} key={key}>
                  <TextField
                    fullWidth
                    size="small"
                    label={t(labelKey)}
                    placeholder={t(placeholderKey)}
                    value={currentValue}
                    onChange={(e) => setLocal({ ...local, [key]: e.target.value })}
                  />
                </Grid>
              );
            }

            // Select filter
            if (type === "select") {
              return (
                <Grid item xs={12} md={4} key={key}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t(labelKey)}</InputLabel>
                    <Select
                      value={currentValue}
                      label={t(labelKey)}
                      onChange={(e) => setLocal({ ...local, [key]: e.target.value })}
                    >
                      {options.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {t(opt.labelKey)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );
            }

            // Date range filter with presets
            if (type === "dateRange") {
              return (
                <Grid item xs={12} md={4} key={key}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{t(labelKey)}</InputLabel>
                    <Select
                      value={currentValue?.preset ?? ""}
                      label={t(labelKey)}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          [key]: {
                            ...currentValue,
                            preset: e.target.value,
                          },
                        })
                      }
                    >
                      {presets.map((preset) => (
                        <MenuItem key={preset.value} value={preset.value}>
                          {t(preset.labelKey)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              );
            }

            return null;
          })}

          {/* Action buttons */}
          <Grid item xs={12} className="flex gap-2 justify-end mt-2">
            <Button variant="outlined" onClick={handleReset}>
              {t("actions.reset")}
            </Button>
            <Button variant="contained" onClick={handleApply}>
              {t("actions.apply")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
