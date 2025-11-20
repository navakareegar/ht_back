# Database Migrations

This directory contains TypeORM database migrations for the Habit Tracker application.

## Available Commands

### Generate a new migration (based on entity changes)
```bash
npm run migration:generate src/migrations/MigrationName
```

### Create a blank migration
```bash
npm run migration:create src/migrations/MigrationName
```

### Run pending migrations
```bash
npm run migration:run
```

### Revert last migration
```bash
npm run migration:revert
```

### Show migration status
```bash
npm run migration:show
```

## Migration Workflow

### Development
1. Make changes to your entities
2. Generate a migration: `npm run migration:generate src/migrations/DescriptiveNameOfChange`
3. Review the generated migration file
4. Run the migration: `npm run migration:run`

### Production
1. Build your application: `npm run build`
2. Run migrations on production database: `npm run migration:run`
3. Start the application: `npm run start:prod`

## Current Migrations

### InitialSchema (1763667369002)
- Creates initial database schema
- Tables: `user`, `habit`, `habit_log`
- Includes foreign key relationships and constraints

## Important Notes

- **Development**: `synchronize: true` is enabled for automatic schema sync
- **Production**: `synchronize: false` - migrations must be run manually
- Always review generated migrations before running them
- Migrations are run in order based on their timestamp
- Keep migration files in version control

## Configuration

Database configuration is split between:
- **Runtime**: `src/app.module.ts` (used by NestJS application)
- **Migrations**: `src/data-source.ts` (used by TypeORM CLI)

Make sure both configurations match your database settings.

## Troubleshooting

### "No changes found" when generating migration
This means your database schema is already in sync with your entities. Either:
- Make changes to your entities first
- Or create a blank migration: `npm run migration:create src/migrations/MyMigration`

### Migration fails to run
- Check database connection settings in `src/data-source.ts`
- Ensure the database exists
- Check for conflicting table/column names

## Best Practices

1. **Descriptive names**: Use clear, descriptive migration names
2. **One purpose**: Each migration should have a single, clear purpose
3. **Review changes**: Always review generated SQL before running
4. **Test rollback**: Test the `down()` method works correctly
5. **No data loss**: Be careful with operations that could lose data

