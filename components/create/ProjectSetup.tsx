"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWizard } from "@/lib/wizard/WizardContext";
import { SelectableCard } from "./SelectableCard";
import {
  PROJECT_TYPES,
  PROPERTY_TYPES,
  AUSTRALIAN_STATES,
  ASBESTOS_YEAR_THRESHOLD,
} from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animation-constants";
import type { ProjectType, PropertyType, AustralianState } from "@/types";

export function ProjectSetup() {
  const { state, dispatch } = useWizard();
  const { projectType, propertyDetails } = state;

  const isValid = !!projectType && !!propertyDetails.state;
  const showAsbestos =
    propertyDetails.yearBuilt != null &&
    propertyDetails.yearBuilt > 0 &&
    propertyDetails.yearBuilt < ASBESTOS_YEAR_THRESHOLD;

  // Configure footer
  useEffect(() => {
    dispatch({
      type: "SET_FOOTER",
      hidden: false,
      label: "Continue",
      disabled: !isValid,
    });
  }, [dispatch, isValid]);

  const handleProjectType = (type: ProjectType) => {
    dispatch({ type: "SET_PROJECT_TYPE", projectType: type });
  };

  const handlePropertyType = (type: PropertyType) => {
    dispatch({ type: "SET_PROPERTY_DETAILS", details: { type } });
  };

  return (
    <div className="space-y-10">
      {/* Project type */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            What are you renovating?
          </h2>
          <p className="text-sm text-muted-foreground">
            Select the room or area for this scope.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Project type"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {PROJECT_TYPES.map((pt) => (
            <motion.div key={pt.id} variants={staggerItem}>
              <SelectableCard
                selected={projectType === pt.id}
                onSelect={() => handleProjectType(pt.id)}
                mode="radio"
                className="px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-hidden>
                    {pt.icon}
                  </span>
                  <div>
                    <p className="font-medium">{pt.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {pt.description}
                    </p>
                  </div>
                </div>
              </SelectableCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Property details */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Property details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Suburb */}
          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              placeholder="e.g. Paddington"
              value={propertyDetails.suburb || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_PROPERTY_DETAILS",
                  details: { suburb: e.target.value },
                })
              }
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={propertyDetails.state || ""}
              onValueChange={(value) =>
                dispatch({
                  type: "SET_PROPERTY_DETAILS",
                  details: { state: value as AustralianState },
                })
              }
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {AUSTRALIAN_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year built */}
          <div className="space-y-2">
            <Label htmlFor="yearBuilt">Year built (approximate)</Label>
            <Input
              id="yearBuilt"
              type="number"
              placeholder="e.g. 1985"
              min={1800}
              max={new Date().getFullYear()}
              value={propertyDetails.yearBuilt || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_PROPERTY_DETAILS",
                  details: {
                    yearBuilt: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  },
                })
              }
            />
          </div>
        </div>

        {/* Asbestos warning */}
        {showAsbestos && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 px-4 py-3"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-warning">
              Properties built before {ASBESTOS_YEAR_THRESHOLD} may contain
              asbestos materials. We&apos;ll flag this in relevant trade scopes
              so tradies can plan accordingly.
            </p>
          </motion.div>
        )}

        {/* Property type */}
        <div className="space-y-2">
          <Label>Property type</Label>
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            role="radiogroup"
            aria-label="Property type"
          >
            {PROPERTY_TYPES.map((pt) => (
              <SelectableCard
                key={pt.value}
                selected={propertyDetails.type === pt.value}
                onSelect={() => handlePropertyType(pt.value)}
                mode="radio"
              >
                <span className="text-sm font-medium">{pt.label}</span>
              </SelectableCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
