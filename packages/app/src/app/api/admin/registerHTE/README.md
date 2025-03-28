# High Traffic Event (HTE) Registration API

This API allows registration of high traffic events and their related events for travel planning and coordination.

## Endpoint

```
POST /api/admin/registerHTE
```

## Request Payload

The API accepts JSON payloads with the following structure:

```json
{
  "city": "Austin",
  "year": 2025,
  "name": "Formula 1 US Grand Prix",
  "date": "2025-10-25",
  "event_type": "Significant",
  "metadata": {
    "organizer": "Circuit of The Americas",
    "capacity": 120000,
    "ticket_prices": {
      "general": 200,
      "premium": 500,
      "vip": 1200
    },
    "sponsors": ["Red Bull", "Emirates", "Rolex"]
  },
  "related_events": [
    {
      "name": "Texas vs. Georgia College Football",
      "date": "2025-10-24",
      "event_type": "Minor",
      "metadata": {
        "venue": "DKR Texas Memorial Stadium",
        "expected_attendance": 98000
      }
    },
    {
      "name": "Diplo Concert",
      "date": "2025-10-26",
      "event_type": "Social",
      "metadata": {
        "venue": "Moody Center",
        "expected_attendance": 15000,
        "tickets_available": true
      }
    }
  ]
}
```

### Required Fields

| Field | event_Type | Description |
|-------|------|-------------|
| `city` | string | The city where the event takes place |
| `year` | number | The year of the event (must be 2024 or later) |
| `name` | string | The name of the main event |
| `date` | string | The date of the event in YYYY-MM-DD format |
| `event_type` | string | The event_type of event (Significant, Minor, Workshop, Conference, Social) |

### Optional Fields

| Field | event_Type | Description |
|-------|------|-------------|
| `metadata` | object | A JSON object containing any additional event details |
| `related_events` | array | An array of related events associated with the main event |

### Related Event Fields

Each related event must include:

| Field | event_Type | Description |
|-------|------|-------------|
| `name` | string | The name of the related event |
| `date` | string | The date of the related event in YYYY-MM-DD format |
| `event_type` | string | The event_type of event (Significant, Minor, Workshop, Conference, Social) |

And may optionally include:

| Field | event_Type | Description |
|-------|------|-------------|
| `metadata` | object | A JSON object containing any additional event details |

## Response

### Success Response

```json
{
  "success": true,
  "message": "Event and related events created successfully",
  "eventId": 123
}
```

### Error Response

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Event name is required"
    }
  ]
}
```

## Examples

### Minimal Request

```json
{
  "city": "Miami",
  "year": 2025,
  "name": "Miami Grand Prix",
  "date": "2025-05-05",
  "event_type": "Significant",
  "related_events": []
}
```

### Full Request with Metadata

```json
{
  "city": "Las Vegas",
  "year": 2025,
  "name": "Las Vegas Grand Prix",
  "date": "2025-11-25",
  "event_type": "Significant",
  "metadata": {
    "organizer": "Formula 1",
    "capacity": 100000,
    "is_night_race": true,
    "sponsors": ["Heineken", "DHL", "Pirelli"],
    "ticket_info": {
      "sale_date": "2024-12-01",
      "website": "https://f1lasvegas.com/tickets"
    }
  },
  "related_events": [
    {
      "name": "Driver Meet & Greet",
      "date": "2025-11-24",
      "event_type": "Social",
      "metadata": {
        "venue": "Bellagio",
        "ticket_price": 350,
        "max_capacity": 500,
        "vip_packages": true
      }
    },
    {
      "name": "F1 Tech Exhibition",
      "date": "2025-11-23",
      "event_type": "Conference",
      "metadata": {
        "venue": "Las Vegas Convention Center",
        "free_entry": true,
        "exhibitors": ["Mercedes", "Ferrari", "Red Bull"]
      }
    }
  ]
}
``` 