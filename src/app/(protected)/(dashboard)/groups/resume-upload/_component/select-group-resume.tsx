import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

interface Group {
    id: string;
    name: string;
    isPublic: boolean;
    tags: string[];
    privateGroupInfo: string | null;
}

interface SelectGroupForResumeProps {
    groups: Group[];
    selectedGroupId: Dispatch<SetStateAction<string | null>>;
}

const SelectGroupForResume = ({ groups, selectedGroupId }: SelectGroupForResumeProps) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value
                            ? groups.find((group) => group.name === value)?.name
                            : 'Select Group...'}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                {/* Setting the PopoverContent width to match the trigger */}
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        {/* The full-width search input */}
                        <CommandInput
                            placeholder="Search framework..."
                            className="h-9 w-full px-3"
                        />
                        <CommandList>
                            <CommandEmpty>No groups found.</CommandEmpty>
                            <CommandGroup>
                                {groups.map((group) => (

                                    !group.isPublic && (
                                        <CommandItem
                                            key={group.id}
                                            value={group.name}
                                            onSelect={(e) => {
                                                setValue(e === value ? "" : e);
                                                setOpen(false);
                                                selectedGroupId(group.id);
                                            }}
                                        >
                                            {group.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    value === group.name ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    )

                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SelectGroupForResume;
